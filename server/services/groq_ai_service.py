"""
Groq AI Service - Server-side AI content generation with analytics and caching
"""
import os
import json
import time
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from groq import Groq
from flask import current_app
try:
    import redis
except ImportError:
    redis = None
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GroqAIService:
    """Server-side Groq AI service with caching, analytics, and error handling"""
    
    def __init__(self):
        self.client = None
        self.redis_client = None
        self.initialize_clients()
    
    def initialize_clients(self):
        """Initialize Groq and Redis clients"""
        try:
            # Initialize Groq client
            api_key = os.getenv('GROQ_API_KEY')
            if not api_key:
                logger.warning("GROQ_API_KEY not found in environment variables")
                return
            
            self.client = Groq(api_key=api_key)
            logger.info("Groq client initialized successfully")
            
            # Initialize Redis for caching (optional)
            if redis is None:
                logger.warning("Redis package not installed, using memory cache")
                self.redis_client = None
            else:
                redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
                try:
                    self.redis_client = redis.from_url(
                        redis_url, 
                        decode_responses=True,
                        socket_connect_timeout=5,
                        socket_timeout=5,
                        retry_on_timeout=True,
                        health_check_interval=30
                    )
                    self.redis_client.ping()  # Test connection
                    logger.info(f"Redis client initialized successfully at {redis_url}")
                except Exception as e:
                    logger.warning(f"Redis not available, using memory cache: {e}")
                    self.redis_client = None
                
        except Exception as e:
            logger.error(f"Failed to initialize AI service: {e}")
    
    def is_available(self) -> bool:
        """Check if AI service is available"""
        return self.client is not None
    
    def _get_cache_key(self, content_type: str, identifier: str) -> str:
        """Generate cache key for content"""
        return f"ai:{content_type}:{identifier}"
    
    def _get_cached_content(self, cache_key: str) -> Optional[Dict]:
        """Get cached AI content"""
        if not self.redis_client:
            return None
        
        try:
            cached = self.redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
        except Exception as e:
            logger.warning(f"Cache read error: {e}")
        return None
    
    def _cache_content(self, cache_key: str, content: Dict, ttl: int = 86400):
        """Cache AI content (default 24 hours)"""
        if not self.redis_client:
            return
        
        try:
            self.redis_client.setex(
                cache_key, 
                ttl, 
                json.dumps(content, default=str)
            )
        except Exception as e:
            logger.warning(f"Cache write error: {e}")
    
    async def generate_product_meta_tags(self, product_data: Dict) -> Dict[str, Any]:
        """Generate SEO-optimized meta tags for products"""
        if not self.is_available():
            return self._get_fallback_meta_tags(product_data)
        
        # Check cache first
        cache_key = self._get_cache_key("meta_tags", f"product_{product_data.get('id')}")
        cached = self._get_cached_content(cache_key)
        if cached:
            logger.info(f"Cache hit for product meta tags: {product_data.get('id')}")
            return cached
        
        start_time = time.time()
        
        try:
            prompt = self._build_product_meta_prompt(product_data)
            
            completion = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama3-8b-8192",
                temperature=0.3,
                max_tokens=500
            )
            
            response_time = int((time.time() - start_time) * 1000)
            response_text = completion.choices[0].message.content.strip()
            
            # Parse JSON response
            try:
                meta_data = json.loads(response_text)
            except json.JSONDecodeError:
                logger.warning("Failed to parse AI response as JSON, using fallback")
                return self._get_fallback_meta_tags(product_data)
            
            # Add metadata
            result = {
                **meta_data,
                'ai_generated': True,
                'model_used': 'llama3-8b-8192',
                'generation_time_ms': response_time,
                'tokens_used': completion.usage.total_tokens,
                'generated_at': datetime.utcnow().isoformat()
            }
            
            # Cache the result
            self._cache_content(cache_key, result)
            
            # Log analytics
            self._log_ai_usage(
                endpoint='generate_product_meta_tags',
                tokens_input=completion.usage.prompt_tokens,
                tokens_output=completion.usage.completion_tokens,
                response_time_ms=response_time,
                success=True
            )
            
            logger.info(f"Generated meta tags for product {product_data.get('id')} in {response_time}ms")
            return result
            
        except Exception as e:
            logger.error(f"AI generation failed: {e}")
            self._log_ai_usage(
                endpoint='generate_product_meta_tags',
                success=False,
                error_message=str(e)
            )
            return self._get_fallback_meta_tags(product_data)
    
    async def generate_product_description(self, product_data: Dict) -> Dict[str, Any]:
        """Generate AI-enhanced product descriptions"""
        if not self.is_available():
            return self._get_fallback_description(product_data)
        
        # Check cache first
        cache_key = self._get_cache_key("description", f"product_{product_data.get('id')}")
        cached = self._get_cached_content(cache_key)
        if cached:
            logger.info(f"Cache hit for product description: {product_data.get('id')}")
            return cached
        
        start_time = time.time()
        
        try:
            prompt = self._build_product_description_prompt(product_data)
            
            completion = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama3-8b-8192",
                temperature=0.7,
                max_tokens=800
            )
            
            response_time = int((time.time() - start_time) * 1000)
            ai_description = completion.choices[0].message.content.strip()
            
            result = {
                'original_description': product_data.get('description', ''),
                'ai_description': ai_description,
                'ai_generated': True,
                'model_used': 'llama3-8b-8192',
                'generation_time_ms': response_time,
                'tokens_used': completion.usage.total_tokens,
                'generated_at': datetime.utcnow().isoformat()
            }
            
            # Cache the result
            self._cache_content(cache_key, result)
            
            # Log analytics
            self._log_ai_usage(
                endpoint='generate_product_description',
                tokens_input=completion.usage.prompt_tokens,
                tokens_output=completion.usage.completion_tokens,
                response_time_ms=response_time,
                success=True
            )
            
            logger.info(f"Generated description for product {product_data.get('id')} in {response_time}ms")
            return result
            
        except Exception as e:
            logger.error(f"AI generation failed: {e}")
            self._log_ai_usage(
                endpoint='generate_product_description',
                success=False,
                error_message=str(e)
            )
            return self._get_fallback_description(product_data)
    
    async def generate_category_meta_tags(self, category_data: Dict) -> Dict[str, Any]:
        """Generate SEO-optimized meta tags for category pages"""
        if not self.is_available():
            return self._get_fallback_category_meta(category_data)
        
        cache_key = self._get_cache_key("meta_tags", f"category_{category_data.get('id')}")
        cached = self._get_cached_content(cache_key)
        if cached:
            return cached
        
        start_time = time.time()
        
        try:
            prompt = f"""Generate SEO-optimized meta tags for this e-commerce category page:

Category Name: {category_data.get('name', 'Category')}
Description: {category_data.get('description', 'Premium products')}
Store: Myjamii Store

Generate a JSON response with:
1. title (50-60 characters, include "Myjamii Store")
2. description (150-160 characters, compelling category description)
3. keywords (8-10 relevant keywords for this category)

Focus on e-commerce SEO best practices and category-specific terms.
Return only valid JSON format."""

            completion = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama3-8b-8192",
                temperature=0.3,
                max_tokens=400
            )
            
            response_time = int((time.time() - start_time) * 1000)
            response_text = completion.choices[0].message.content.strip()
            
            try:
                meta_data = json.loads(response_text)
            except json.JSONDecodeError:
                return self._get_fallback_category_meta(category_data)
            
            result = {
                **meta_data,
                'ai_generated': True,
                'model_used': 'llama3-8b-8192',
                'generation_time_ms': response_time,
                'tokens_used': completion.usage.total_tokens,
                'generated_at': datetime.utcnow().isoformat()
            }
            
            self._cache_content(cache_key, result)
            self._log_ai_usage(
                endpoint='generate_category_meta_tags',
                tokens_input=completion.usage.prompt_tokens,
                tokens_output=completion.usage.completion_tokens,
                response_time_ms=response_time,
                success=True
            )
            
            return result
            
        except Exception as e:
            logger.error(f"AI generation failed: {e}")
            return self._get_fallback_category_meta(category_data)
    
    def _build_product_meta_prompt(self, product_data: Dict) -> str:
        """Build prompt for product meta tag generation"""
        return f"""Generate SEO-optimized meta tags for this e-commerce product:

Product Name: {product_data.get('name', 'Product')}
Category: {product_data.get('category', 'General')}
Price: ${product_data.get('price', '0')}
Description: {product_data.get('description', 'Premium quality product')}

Generate a JSON response with:
1. title (50-60 characters, include "Myjamii Store")
2. description (150-160 characters, compelling, include price and key benefits)
3. keywords (5-8 relevant keywords separated by commas)

Focus on e-commerce SEO best practices and buying intent keywords.
Return only valid JSON format."""
    
    def _build_product_description_prompt(self, product_data: Dict) -> str:
        """Build prompt for product description generation"""
        return f"""Write an SEO-optimized e-commerce product description for:

Product Name: {product_data.get('name', 'Product')}
Category: {product_data.get('category', 'General')}
Price: ${product_data.get('price', '0')}
Current Description: {product_data.get('description', 'No description available')}

Requirements:
- 100-150 words
- Include key features and benefits
- Use persuasive e-commerce language
- Include relevant keywords naturally
- Add call-to-action
- Focus on customer value proposition
- Highlight quality and reliability

Write an engaging product description that converts browsers to buyers."""
    
    def _get_fallback_meta_tags(self, product_data: Dict) -> Dict[str, Any]:
        """Fallback meta tags when AI is unavailable"""
        return {
            'title': f"{product_data.get('name', 'Product')} | Myjamii Store",
            'description': f"Buy {product_data.get('name', 'this product')} for ${product_data.get('price', '0')}. High-quality products at Myjamii Store. Fast shipping and excellent customer service.",
            'keywords': f"{product_data.get('name', 'product')}, buy online, e-commerce, {product_data.get('category', 'products')}, Myjamii Store",
            'ai_generated': False,
            'generated_at': datetime.utcnow().isoformat()
        }
    
    def _get_fallback_description(self, product_data: Dict) -> Dict[str, Any]:
        """Fallback description when AI is unavailable"""
        fallback_desc = f"Experience premium quality with {product_data.get('name', 'this product')}. Perfect for your needs at an unbeatable price of ${product_data.get('price', '0')}. Shop with confidence at Myjamii Store."
        
        return {
            'original_description': product_data.get('description', ''),
            'ai_description': fallback_desc,
            'ai_generated': False,
            'generated_at': datetime.utcnow().isoformat()
        }
    
    def _get_fallback_category_meta(self, category_data: Dict) -> Dict[str, Any]:
        """Fallback meta tags for categories when AI is unavailable"""
        return {
            'title': f"{category_data.get('name', 'Category')} | Myjamii Store",
            'description': f"Shop premium {category_data.get('name', 'products').lower()} at Myjamii Store. Quality items with fast shipping and great prices.",
            'keywords': f"{category_data.get('name', 'products').lower()}, online shopping, e-commerce, quality products, Myjamii Store",
            'ai_generated': False,
            'generated_at': datetime.utcnow().isoformat()
        }
    
    def _log_ai_usage(self, endpoint: str, tokens_input: int = 0, tokens_output: int = 0, 
                      response_time_ms: int = 0, success: bool = True, error_message: str = None):
        """Log AI usage for analytics (will be stored in database)"""
        usage_data = {
            'endpoint': endpoint,
            'tokens_input': tokens_input,
            'tokens_output': tokens_output,
            'tokens_total': tokens_input + tokens_output,
            'response_time_ms': response_time_ms,
            'success': success,
            'error_message': error_message,
            'timestamp': datetime.utcnow().isoformat(),
            'cost_estimate_cents': self._calculate_cost(tokens_input + tokens_output)
        }
        
        # For now, log to console. Later we'll store in database.
        logger.info(f"AI Usage: {json.dumps(usage_data)}")
    
    def _calculate_cost(self, total_tokens: int) -> float:
        """Calculate estimated cost for Groq API usage"""
        # Groq Mixtral-8x7b pricing: $0.27 per 1M input tokens, $0.27 per 1M output tokens
        cost_per_token = 0.27 / 1_000_000
        return total_tokens * cost_per_token * 100  # Return in cents
    
    def get_usage_stats(self, days: int = 30) -> Dict[str, Any]:
        """Get AI usage statistics for analytics dashboard"""
        # This will be implemented when we have database storage
        return {
            'total_requests': 0,
            'total_tokens': 0,
            'total_cost_cents': 0,
            'success_rate': 100.0,
            'avg_response_time_ms': 0,
            'cache_hit_rate': 0,
            'period_days': days
        }

# Global instance
groq_service = GroqAIService()