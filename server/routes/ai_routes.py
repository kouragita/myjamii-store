"""
AI API Routes - Server-side AI content generation endpoints
"""
import asyncio
from flask import request, jsonify
from flask_restful import Resource, reqparse
from models import db, Product, Category, AIGeneratedContent, AIUsageAnalytics, SEOMetadata
from services.groq_ai_service import groq_service
import logging

logger = logging.getLogger(__name__)

class AIProductDescriptionAPI(Resource):
    """Generate AI-enhanced product descriptions"""
    
    def post(self, product_id):
        """Generate AI description for a specific product"""
        try:
            # Get product from database
            product = Product.query.get(product_id)
            if not product:
                return {'error': 'Product not found'}, 404
            
            # Check if we already have AI-generated content
            existing_content = AIGeneratedContent.query.filter_by(
                content_type='product_description',
                entity_type='product',
                entity_id=product_id,
                is_active=True
            ).first()
            
            if existing_content:
                # Update usage count
                existing_content.usage_count += 1
                db.session.commit()
                
                return {
                    'success': True,
                    'cached': True,
                    'content': existing_content.to_dict(),
                    'original_description': product.description,
                    'ai_description': existing_content.ai_content
                }
            
            # Prepare product data for AI
            product_data = {
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': product.price,
                'category': product.category.name if product.category else 'General'
            }
            
            # Generate AI content
            result = asyncio.run(groq_service.generate_product_description(product_data))
            
            if not result:
                return {'error': 'Failed to generate AI description'}, 500
            
            # Store in database
            ai_content = AIGeneratedContent(
                content_type='product_description',
                entity_type='product',
                entity_id=product_id,
                original_content=product.description,
                ai_content=result['ai_description'],
                model_used=result.get('model_used', 'mixtral-8x7b-32768'),
                tokens_used=result.get('tokens_used', 0),
                generation_time_ms=result.get('generation_time_ms', 0),
                usage_count=1
            )
            
            db.session.add(ai_content)
            
            # Log analytics
            analytics = AIUsageAnalytics(
                endpoint='ai_product_description',
                request_type='product_description',
                entity_type='product',
                entity_id=product_id,
                tokens_input=result.get('tokens_used', 0) // 2,  # Rough estimate
                tokens_output=result.get('tokens_used', 0) // 2,
                tokens_total=result.get('tokens_used', 0),
                response_time_ms=result.get('generation_time_ms', 0),
                success=True,
                cost_cents=result.get('tokens_used', 0) * 0.27 / 1000000 * 100,  # Groq pricing
                model_used=result.get('model_used', 'mixtral-8x7b-32768'),
                user_ip=request.remote_addr,
                user_agent=request.headers.get('User-Agent', '')
            )
            
            db.session.add(analytics)
            db.session.commit()
            
            return {
                'success': True,
                'cached': False,
                'content': ai_content.to_dict(),
                'original_description': product.description,
                'ai_description': result['ai_description']
            }
            
        except Exception as e:
            logger.error(f"AI description generation failed: {e}")
            
            # Log failed attempt
            try:
                analytics = AIUsageAnalytics(
                    endpoint='ai_product_description',
                    request_type='product_description',
                    entity_type='product',
                    entity_id=product_id,
                    success=False,
                    error_message=str(e),
                    user_ip=request.remote_addr,
                    user_agent=request.headers.get('User-Agent', '')
                )
                db.session.add(analytics)
                db.session.commit()
            except Exception as log_error:
                logger.error(f"Failed to log error: {log_error}")
            
            return {'error': 'Internal server error'}, 500


class AIProductMetaTagsAPI(Resource):
    """Generate AI-optimized meta tags for products"""
    
    def post(self, product_id):
        """Generate AI meta tags for a specific product"""
        try:
            product = Product.query.get(product_id)
            if not product:
                return {'error': 'Product not found'}, 404
            
            # Check existing SEO metadata
            existing_seo = SEOMetadata.query.filter_by(
                page_type='product',
                entity_id=product_id,
                is_active=True
            ).first()
            
            if existing_seo and existing_seo.is_ai_generated:
                return {
                    'success': True,
                    'cached': True,
                    'seo_data': existing_seo.to_dict()
                }
            
            # Prepare product data
            product_data = {
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': product.price,
                'category': product.category.name if product.category else 'General'
            }
            
            # Generate AI meta tags
            result = asyncio.run(groq_service.generate_product_meta_tags(product_data))
            
            if not result:
                return {'error': 'Failed to generate meta tags'}, 500
            
            # Store/update SEO metadata
            if existing_seo:
                existing_seo.meta_title = result.get('title', '')
                existing_seo.meta_description = result.get('description', '')
                existing_seo.meta_keywords = result.get('keywords', '')
                existing_seo.is_ai_generated = True
                seo_data = existing_seo
            else:
                seo_data = SEOMetadata(
                    page_type='product',
                    entity_id=product_id,
                    meta_title=result.get('title', ''),
                    meta_description=result.get('description', ''),
                    meta_keywords=result.get('keywords', ''),
                    is_ai_generated=True
                )
                db.session.add(seo_data)
            
            # Log analytics
            analytics = AIUsageAnalytics(
                endpoint='ai_product_meta_tags',
                request_type='meta_tags',
                entity_type='product',
                entity_id=product_id,
                tokens_total=result.get('tokens_used', 0),
                response_time_ms=result.get('generation_time_ms', 0),
                success=True,
                cost_cents=result.get('tokens_used', 0) * 0.27 / 1000000 * 100,
                model_used=result.get('model_used', 'mixtral-8x7b-32768'),
                user_ip=request.remote_addr,
                user_agent=request.headers.get('User-Agent', '')
            )
            
            db.session.add(analytics)
            db.session.commit()
            
            return {
                'success': True,
                'cached': False,
                'seo_data': seo_data.to_dict(),
                'meta_tags': {
                    'title': result.get('title', ''),
                    'description': result.get('description', ''),
                    'keywords': result.get('keywords', '')
                }
            }
            
        except Exception as e:
            logger.error(f"AI meta tags generation failed: {e}")
            return {'error': 'Internal server error'}, 500


class AICategoryMetaTagsAPI(Resource):
    """Generate AI-optimized meta tags for category pages"""
    
    def post(self, category_id):
        """Generate AI meta tags for a category"""
        try:
            category = Category.query.get(category_id)
            if not category:
                return {'error': 'Category not found'}, 404
            
            # Check existing SEO metadata
            existing_seo = SEOMetadata.query.filter_by(
                page_type='category',
                entity_id=category_id,
                is_active=True
            ).first()
            
            if existing_seo and existing_seo.is_ai_generated:
                return {
                    'success': True,
                    'cached': True,
                    'seo_data': existing_seo.to_dict()
                }
            
            # Prepare category data
            category_data = {
                'id': category.id,
                'name': category.name,
                'description': category.description
            }
            
            # Generate AI meta tags
            result = asyncio.run(groq_service.generate_category_meta_tags(category_data))
            
            if not result:
                return {'error': 'Failed to generate category meta tags'}, 500
            
            # Store/update SEO metadata
            if existing_seo:
                existing_seo.meta_title = result.get('title', '')
                existing_seo.meta_description = result.get('description', '')
                existing_seo.meta_keywords = result.get('keywords', '')
                existing_seo.is_ai_generated = True
                seo_data = existing_seo
            else:
                seo_data = SEOMetadata(
                    page_type='category',
                    entity_id=category_id,
                    meta_title=result.get('title', ''),
                    meta_description=result.get('description', ''),
                    meta_keywords=result.get('keywords', ''),
                    is_ai_generated=True
                )
                db.session.add(seo_data)
            
            # Log analytics
            analytics = AIUsageAnalytics(
                endpoint='ai_category_meta_tags',
                request_type='meta_tags',
                entity_type='category',
                entity_id=category_id,
                tokens_total=result.get('tokens_used', 0),
                response_time_ms=result.get('generation_time_ms', 0),
                success=True,
                cost_cents=result.get('tokens_used', 0) * 0.27 / 1000000 * 100,
                model_used=result.get('model_used', 'mixtral-8x7b-32768'),
                user_ip=request.remote_addr
            )
            
            db.session.add(analytics)
            db.session.commit()
            
            return {
                'success': True,
                'cached': False,
                'seo_data': seo_data.to_dict(),
                'meta_tags': {
                    'title': result.get('title', ''),
                    'description': result.get('description', ''),
                    'keywords': result.get('keywords', '')
                }
            }
            
        except Exception as e:
            logger.error(f"AI category meta tags generation failed: {e}")
            return {'error': 'Internal server error'}, 500


class AIBatchGenerationAPI(Resource):
    """Batch generate AI content for multiple entities"""
    
    def post(self):
        """Batch generate AI content"""
        parser = reqparse.RequestParser()
        parser.add_argument('entity_type', type=str, required=True, choices=['products', 'categories'])
        parser.add_argument('content_type', type=str, required=True, choices=['descriptions', 'meta_tags'])
        parser.add_argument('entity_ids', type=list, location='json', required=False)
        parser.add_argument('limit', type=int, default=10)
        args = parser.parse_args()
        
        try:
            results = []
            
            if args['entity_type'] == 'products':
                if args['entity_ids']:
                    products = Product.query.filter(Product.id.in_(args['entity_ids'])).all()
                else:
                    products = Product.query.limit(args['limit']).all()
                
                for product in products:
                    if args['content_type'] == 'descriptions':
                        # Generate description
                        result = asyncio.run(self._generate_product_description(product))
                        results.append(result)
                    elif args['content_type'] == 'meta_tags':
                        # Generate meta tags
                        result = asyncio.run(self._generate_product_meta(product))
                        results.append(result)
            
            db.session.commit()
            
            return {
                'success': True,
                'batch_size': len(results),
                'results': results,
                'total_cost_cents': sum(r.get('cost_cents', 0) for r in results),
                'total_tokens': sum(r.get('tokens_used', 0) for r in results)
            }
            
        except Exception as e:
            logger.error(f"Batch AI generation failed: {e}")
            return {'error': 'Batch generation failed'}, 500
    
    async def _generate_product_description(self, product):
        """Helper method for batch description generation"""
        product_data = {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'category': product.category.name if product.category else 'General'
        }
        
        result = await groq_service.generate_product_description(product_data)
        
        if result:
            # Store in database
            ai_content = AIGeneratedContent(
                content_type='product_description',
                entity_type='product',
                entity_id=product.id,
                original_content=product.description,
                ai_content=result['ai_description'],
                model_used=result.get('model_used', 'mixtral-8x7b-32768'),
                tokens_used=result.get('tokens_used', 0),
                generation_time_ms=result.get('generation_time_ms', 0)
            )
            db.session.add(ai_content)
        
        return result
    
    async def _generate_product_meta(self, product):
        """Helper method for batch meta generation"""
        product_data = {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'category': product.category.name if product.category else 'General'
        }
        
        result = await groq_service.generate_product_meta_tags(product_data)
        
        if result:
            # Store in database
            seo_data = SEOMetadata(
                page_type='product',
                entity_id=product.id,
                meta_title=result.get('title', ''),
                meta_description=result.get('description', ''),
                meta_keywords=result.get('keywords', ''),
                is_ai_generated=True
            )
            db.session.add(seo_data)
        
        return result


class AIAnalyticsAPI(Resource):
    """Get AI usage analytics and performance metrics"""
    
    def get(self):
        """Get AI analytics dashboard data"""
        parser = reqparse.RequestParser()
        parser.add_argument('days', type=int, default=30)
        parser.add_argument('metric', type=str, choices=['usage', 'cost', 'performance'])
        args = parser.parse_args()
        
        try:
            from datetime import datetime, timedelta
            
            start_date = datetime.utcnow() - timedelta(days=args['days'])
            
            # Usage analytics
            usage_data = db.session.query(AIUsageAnalytics).filter(
                AIUsageAnalytics.created_at >= start_date
            ).all()
            
            total_requests = len(usage_data)
            successful_requests = sum(1 for u in usage_data if u.success)
            total_tokens = sum(u.tokens_total for u in usage_data)
            total_cost_cents = sum(u.cost_cents for u in usage_data)
            avg_response_time = sum(u.response_time_ms for u in usage_data) / len(usage_data) if usage_data else 0
            
            # Performance by endpoint
            endpoint_stats = {}
            for usage in usage_data:
                if usage.endpoint not in endpoint_stats:
                    endpoint_stats[usage.endpoint] = {
                        'requests': 0,
                        'success_rate': 0,
                        'avg_response_time': 0,
                        'total_cost_cents': 0
                    }
                
                endpoint_stats[usage.endpoint]['requests'] += 1
                endpoint_stats[usage.endpoint]['total_cost_cents'] += usage.cost_cents
            
            # AI content statistics
            ai_content_count = db.session.query(AIGeneratedContent).filter(
                AIGeneratedContent.created_at >= start_date
            ).count()
            
            return {
                'success': True,
                'period_days': args['days'],
                'summary': {
                    'total_requests': total_requests,
                    'successful_requests': successful_requests,
                    'success_rate': (successful_requests / total_requests * 100) if total_requests > 0 else 0,
                    'total_tokens': total_tokens,
                    'total_cost_cents': total_cost_cents,
                    'total_cost_dollars': total_cost_cents / 100,
                    'avg_response_time_ms': avg_response_time,
                    'ai_content_generated': ai_content_count
                },
                'endpoint_stats': endpoint_stats,
                'daily_usage': self._get_daily_usage_stats(start_date)
            }
            
        except Exception as e:
            logger.error(f"Analytics retrieval failed: {e}")
            return {'error': 'Failed to retrieve analytics'}, 500
    
    def _get_daily_usage_stats(self, start_date):
        """Get daily usage statistics for charts"""
        from sqlalchemy import func, DATE
        
        daily_stats = db.session.query(
            func.DATE(AIUsageAnalytics.created_at).label('date'),
            func.count(AIUsageAnalytics.id).label('requests'),
            func.sum(AIUsageAnalytics.tokens_total).label('tokens'),
            func.sum(AIUsageAnalytics.cost_cents).label('cost_cents')
        ).filter(
            AIUsageAnalytics.created_at >= start_date
        ).group_by(
            func.DATE(AIUsageAnalytics.created_at)
        ).all()
        
        return [
            {
                'date': stat.date.isoformat(),
                'requests': stat.requests,
                'tokens': stat.tokens or 0,
                'cost_cents': float(stat.cost_cents) or 0
            }
            for stat in daily_stats
        ]