"""
Intelligent AI Product Optimization Service
Analyzes complete product context and generates custom SEO enhancements
"""
import asyncio
import json
import time
from typing import Dict, Any, List, Optional
from datetime import datetime
from groq import Groq
from models import db, Product, Category, AIGeneratedContent, SEOMetadata, AIUsageAnalytics
import os
import logging

logger = logging.getLogger(__name__)

class IntelligentAIOptimizer:
    """Advanced AI service for intelligent product SEO optimization"""
    
    def __init__(self):
        self.client = None
        self.initialize_client()
    
    def initialize_client(self):
        """Initialize Groq AI client"""
        try:
            api_key = os.getenv('GROQ_API_KEY')
            if not api_key:
                logger.warning("GROQ_API_KEY not found")
                return
            
            self.client = Groq(api_key=api_key)
            logger.info("Intelligent AI optimizer initialized")
        except Exception as e:
            logger.error(f"Failed to initialize AI optimizer: {e}")
    
    async def analyze_and_optimize_product(self, product_id: int) -> Dict[str, Any]:
        """
        Comprehensive product analysis and SEO optimization
        Reads ALL product details and creates intelligent enhancements
        """
        if not self.client:
            return {"success": False, "error": "AI client not available"}
        
        try:
            # Get complete product context
            product = Product.query.get(product_id)
            if not product:
                return {"success": False, "error": "Product not found"}
            
            category = Category.query.get(product.category_id) if product.category_id else None
            
            # Gather market intelligence
            similar_products = Product.query.filter(
                Product.category_id == product.category_id,
                Product.id != product.id
            ).limit(5).all()
            
            # Create comprehensive product context
            product_context = {
                "id": product.id,
                "name": product.name,
                "original_description": product.description,
                "price": float(product.price),
                "stock_level": product.stock,
                "category": {
                    "name": category.name if category else "Uncategorized",
                    "description": category.description if category else ""
                },
                "market_context": {
                    "similar_products": [
                        {
                            "name": p.name,
                            "price": float(p.price),
                            "description": p.description[:100] + "..." if len(p.description) > 100 else p.description
                        } for p in similar_products
                    ],
                    "price_range": {
                        "min": min([float(p.price) for p in similar_products]) if similar_products else float(product.price),
                        "max": max([float(p.price) for p in similar_products]) if similar_products else float(product.price),
                        "average": sum([float(p.price) for p in similar_products]) / len(similar_products) if similar_products else float(product.price)
                    }
                }
            }
            
            start_time = time.time()
            
            # Generate intelligent optimization
            optimization_result = await self._generate_intelligent_optimization(product_context)
            
            processing_time = int((time.time() - start_time) * 1000)
            
            # DEBUG: Log what we got from AI generation
            logger.info(f"🔍 DEBUG: optimization_result for product {product_id}: {type(optimization_result)} - {bool(optimization_result)}")
            if optimization_result:
                logger.info(f"🔍 DEBUG: optimization keys: {list(optimization_result.keys()) if isinstance(optimization_result, dict) else 'not a dict'}")
            
            if optimization_result:
                # Save to database
                await self._save_optimization_results(product, optimization_result, processing_time)
                
                return {
                    "success": True,
                    "product_id": product_id,
                    "original_description": product.description,
                    "optimization": optimization_result,
                    "processing_time_ms": processing_time,
                    "market_analysis": product_context["market_context"]
                }
            
            return {"success": False, "error": "Failed to generate optimization"}
            
        except Exception as e:
            logger.error(f"Product optimization failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def _generate_intelligent_optimization(self, product_context: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Generate intelligent SEO optimization based on complete product analysis"""
        
        # Create sophisticated prompt with market intelligence
        prompt = f"""You are an expert e-commerce SEO specialist and product marketing analyst. 

PRODUCT TO OPTIMIZE:
- Name: {product_context['name']}
- Original Description: {product_context['original_description']}
- Price: ${product_context['price']:.2f}
- Stock Level: {product_context['stock_level']} units
- Category: {product_context['category']['name']} - {product_context['category']['description']}

MARKET INTELLIGENCE:
- Similar Products in Category: {len(product_context['market_context']['similar_products'])} competitors
- Price Positioning: ${product_context['market_context']['price_range']['min']:.2f} - ${product_context['market_context']['price_range']['max']:.2f} (avg: ${product_context['market_context']['price_range']['average']:.2f})
- Competitor Examples: {'; '.join([f"{p['name']} (${p['price']:.2f})" for p in product_context['market_context']['similar_products'][:3]])}

OPTIMIZATION REQUIREMENTS:
1. **Enhanced Description**: Improve the original description while PRESERVING its core message and authenticity
2. **SEO Keywords**: Generate high-converting, product-specific keywords (NOT generic ones)
3. **Meta Title**: Create compelling 50-60 character title for search engines
4. **Meta Description**: Write persuasive 150-160 character description that drives clicks
5. **Unique Selling Points**: Identify what makes THIS specific product stand out
6. **Search Intent Optimization**: Target buyer-intent keywords based on price point and category

CRITICAL INSTRUCTIONS:
- DO NOT use generic phrases like "premium quality" or "best choice"
- BE SPECIFIC to this exact product and its unique characteristics
- CONSIDER the price point and stock level in your optimization
- MAINTAIN the original product's authentic voice and core features
- FOCUS on what makes this product different from competitors
- USE long-tail keywords that buyers actually search for

Return ONLY valid JSON in this exact format:
{{
    "enhanced_description": "Improved description that retains core message but adds SEO value",
    "meta_title": "Compelling 50-60 char title with product name and key benefit",
    "meta_description": "150-160 char description that drives clicks and includes main keyword",
    "keywords": "5-8 specific, high-intent keywords separated by commas",
    "unique_selling_points": ["Point 1", "Point 2", "Point 3"],
    "optimization_reasoning": "Brief explanation of why these changes will improve SEO performance"
}}"""

        try:
            completion = await asyncio.to_thread(
                self.client.chat.completions.create,
                messages=[{"role": "user", "content": prompt}],
                model="llama3-8b-8192",
                temperature=0.3,
                max_tokens=1000
            )
            
            response_text = completion.choices[0].message.content.strip()
            
            # DEBUG: Log raw AI response
            logger.info(f"🔍 DEBUG: Raw AI response: '{response_text[:200]}...' (length: {len(response_text)})")
            
            # Clean and parse JSON response
            if response_text.startswith('```json'):
                response_text = response_text[7:-3]
            elif response_text.startswith('```'):
                response_text = response_text[3:-3]
            
            # Extract JSON from text that may have explanatory prefix
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                response_text = response_text[json_start:json_end]
            
            logger.info(f"🔍 DEBUG: Final JSON: '{response_text[:200]}...' (length: {len(response_text)})")
            
            result = json.loads(response_text)
            
            # Add metadata
            result['tokens_used'] = completion.usage.total_tokens if completion.usage else 0
            result['model_used'] = "llama3-8b-8192"
            
            return result
            
        except Exception as e:
            logger.error(f"AI optimization generation failed: {e}")
            return None
    
    async def _save_optimization_results(self, product: Product, optimization: Dict[str, Any], processing_time: int):
        """Save optimization results to database with proper tracking"""
        
        logger.info(f"🔍 DEBUG: Attempting to save optimization for product {product.id}")
        try:
            # Save enhanced content
            ai_content = AIGeneratedContent(
                content_type='intelligent_optimization',
                entity_type='product',
                entity_id=product.id,
                original_content=product.description,
                ai_content=json.dumps(optimization),
                model_used=optimization.get('model_used', 'llama3-8b-8192'),
                tokens_used=optimization.get('tokens_used', 0),
                generation_time_ms=processing_time,
                quality_score=0.95,  # High quality due to intelligent analysis
                usage_count=0,
                is_active=True
            )
            db.session.add(ai_content)
            
            # Save/update SEO metadata
            existing_seo = SEOMetadata.query.filter_by(
                page_type='product',
                entity_id=product.id
            ).first()
            
            if existing_seo:
                existing_seo.meta_title = optimization.get('meta_title', '')
                existing_seo.meta_description = optimization.get('meta_description', '')
                existing_seo.meta_keywords = optimization.get('keywords', '')
                existing_seo.is_ai_generated = True
                existing_seo.updated_at = datetime.utcnow()
            else:
                seo_metadata = SEOMetadata(
                    page_type='product',
                    entity_id=product.id,
                    meta_title=optimization.get('meta_title', ''),
                    meta_description=optimization.get('meta_description', ''),
                    meta_keywords=optimization.get('keywords', ''),
                    is_ai_generated=True,
                    performance_score=0.0,
                    is_active=True
                )
                db.session.add(seo_metadata)
            
            # Log analytics
            analytics = AIUsageAnalytics(
                endpoint='intelligent_optimization',
                request_type='product_optimization',
                entity_type='product',
                entity_id=product.id,
                tokens_total=optimization.get('tokens_used', 0),
                response_time_ms=processing_time,
                success=True,
                cost_cents=optimization.get('tokens_used', 0) * 0.27 / 1000000 * 100,
                model_used=optimization.get('model_used', 'llama3-8b-8192')
            )
            db.session.add(analytics)
            
            db.session.commit()
            logger.info(f"🔍 DEBUG: ✅ Optimization results SUCCESSFULLY saved for product {product.id}")
            
        except Exception as e:
            logger.error(f"🔍 DEBUG: ❌ Failed to save optimization results for product {product.id}: {e}")
            db.session.rollback()
            raise e  # Re-raise so caller knows it failed
    
    async def patch_product_with_optimization(self, product_id: int, apply_changes: bool = True) -> Dict[str, Any]:
        """
        Apply AI optimization directly to product in database
        Patches the actual product record with enhanced description and keywords
        """
        try:
            product = Product.query.get(product_id)
            if not product:
                return {"success": False, "error": "Product not found"}
            
            # Get latest optimization
            latest_optimization = AIGeneratedContent.query.filter_by(
                content_type='intelligent_optimization',
                entity_type='product',
                entity_id=product_id,
                is_active=True
            ).order_by(AIGeneratedContent.created_at.desc()).first()
            
            if not latest_optimization:
                return {"success": False, "error": "No optimization found for this product"}
            
            optimization_data = json.loads(latest_optimization.ai_content)
            
            if apply_changes:
                # Backup original data
                original_description = product.description
                
                # Apply enhanced description to product
                product.description = optimization_data.get('enhanced_description', product.description)
                
                # Mark as AI optimized (you might want to add this field to Product model)
                # product.is_ai_optimized = True
                # product.ai_optimization_date = datetime.utcnow()
                
                db.session.commit()
                
                return {
                    "success": True,
                    "product_id": product_id,
                    "changes_applied": True,
                    "original_description": original_description,
                    "new_description": product.description,
                    "optimization_data": optimization_data
                }
            else:
                return {
                    "success": True,
                    "product_id": product_id,
                    "changes_applied": False,
                    "preview": optimization_data,
                    "current_description": product.description
                }
                
        except Exception as e:
            logger.error(f"Failed to patch product: {e}")
            db.session.rollback()
            return {"success": False, "error": str(e)}
    
    async def batch_optimize_products(self, category_id: Optional[int] = None, limit: int = 10) -> Dict[str, Any]:
        """Batch optimize multiple products with intelligent analysis"""
        
        try:
            query = Product.query
            if category_id:
                query = query.filter(Product.category_id == category_id)
            
            products = query.limit(limit).all()
            
            results = []
            total_cost = 0
            total_tokens = 0
            
            for product in products:
                result = await self.analyze_and_optimize_product(product.id)
                results.append(result)
                
                if result.get('success'):
                    optimization = result.get('optimization', {})
                    total_tokens += optimization.get('tokens_used', 0)
                    total_cost += optimization.get('tokens_used', 0) * 0.27 / 1000000
            
            return {
                "success": True,
                "optimized_count": len([r for r in results if r.get('success')]),
                "total_products": len(products),
                "results": results,
                "batch_summary": {
                    "total_tokens": total_tokens,
                    "total_cost_cents": total_cost * 100,
                    "average_processing_time": sum([r.get('processing_time_ms', 0) for r in results if r.get('success')]) / len([r for r in results if r.get('success')]) if results else 0
                }
            }
            
        except Exception as e:
            logger.error(f"Batch optimization failed: {e}")
            return {"success": False, "error": str(e)}

# Global instance
intelligent_optimizer = IntelligentAIOptimizer()