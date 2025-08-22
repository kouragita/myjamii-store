"""
Admin AI Routes - Intelligent Product Optimization and Analytics
Admin-only endpoints for AI-powered SEO management
"""
import asyncio
from flask import request, jsonify
from flask_restful import Resource, reqparse
from models import db, Product, Category, AIGeneratedContent, AIUsageAnalytics, SEOMetadata
from services.intelligent_ai_service import intelligent_optimizer
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class AdminProductOptimizationAPI(Resource):
    """Admin endpoint for intelligent product optimization"""
    
    def post(self, product_id):
        """Analyze and optimize a specific product with AI"""
        try:
            result = asyncio.run(intelligent_optimizer.analyze_and_optimize_product(product_id))
            return result
        except Exception as e:
            logger.error(f"Product optimization failed: {e}")
            return {'error': 'Optimization failed', 'details': str(e)}, 500
    
    def get(self, product_id):
        """Get optimization status and results for a product"""
        try:
            product = Product.query.get(product_id)
            if not product:
                return {'error': 'Product not found'}, 404
            
            # Get latest optimization
            latest_optimization = AIGeneratedContent.query.filter_by(
                content_type='intelligent_optimization',
                entity_type='product',
                entity_id=product_id,
                is_active=True
            ).order_by(AIGeneratedContent.created_at.desc()).first()
            
            # Get SEO metadata
            seo_metadata = SEOMetadata.query.filter_by(
                page_type='product',
                entity_id=product_id,
                is_active=True
            ).first()
            
            return {
                'success': True,
                'product': {
                    'id': product.id,
                    'name': product.name,
                    'description': product.description,
                    'price': product.price,
                    'stock': product.stock
                },
                'has_optimization': latest_optimization is not None,
                'optimization': latest_optimization.to_dict() if latest_optimization else None,
                'seo_metadata': seo_metadata.to_dict() if seo_metadata else None
            }
            
        except Exception as e:
            logger.error(f"Failed to get optimization status: {e}")
            return {'error': 'Failed to get status'}, 500

class AdminProductPatchAPI(Resource):
    """Admin endpoint for applying AI optimizations to products"""
    
    def get(self, product_id):
        """Get patch status and preview for a product"""
        try:
            result = asyncio.run(
                intelligent_optimizer.patch_product_with_optimization(
                    product_id, 
                    apply_changes=False  # Preview only
                )
            )
            
            if result.get('success'):
                # Add patch status information
                import json
                from models import Product, AIGeneratedContent
                
                product = Product.query.get(product_id)
                latest_optimization = AIGeneratedContent.query.filter_by(
                    content_type='intelligent_optimization',
                    entity_type='product',
                    entity_id=product_id,
                    is_active=True
                ).order_by(AIGeneratedContent.created_at.desc()).first()
                
                if latest_optimization and product:
                    optimization_data = json.loads(latest_optimization.ai_content)
                    enhanced_desc = optimization_data.get('enhanced_description', '')
                    current_desc = product.description or ''
                    
                    result['patch_needed'] = enhanced_desc != current_desc
                    result['current_description'] = current_desc
                    result['enhanced_description'] = enhanced_desc
                    result['optimization_date'] = latest_optimization.created_at.isoformat()
            
            return result
        except Exception as e:
            logger.error(f"Product patch status failed: {e}")
            return {'error': 'Patch status check failed', 'details': str(e)}, 500
    
    def post(self, product_id):
        """Apply AI optimization to product in database"""
        parser = reqparse.RequestParser()
        parser.add_argument('apply_changes', type=bool, default=False)
        args = parser.parse_args()
        
        try:
            result = asyncio.run(
                intelligent_optimizer.patch_product_with_optimization(
                    product_id, 
                    apply_changes=args['apply_changes']
                )
            )
            return result
        except Exception as e:
            logger.error(f"Product patching failed: {e}")
            return {'error': 'Patching failed', 'details': str(e)}, 500

class AdminPatchStatusAPI(Resource):
    """Admin endpoint to check patch status for all products"""
    
    def get(self):
        """Get patch status for all optimized products"""
        try:
            from models import Product, AIGeneratedContent
            import json
            
            # Get all products with optimizations
            optimized_products = db.session.query(Product).join(
                AIGeneratedContent, Product.id == AIGeneratedContent.entity_id
            ).filter(
                AIGeneratedContent.content_type == 'intelligent_optimization',
                AIGeneratedContent.is_active == True
            ).distinct().all()
            
            patch_status = []
            
            for product in optimized_products:
                # Get latest optimization
                latest_optimization = AIGeneratedContent.query.filter_by(
                    content_type='intelligent_optimization',
                    entity_type='product',
                    entity_id=product.id,
                    is_active=True
                ).order_by(AIGeneratedContent.created_at.desc()).first()
                
                if latest_optimization:
                    optimization_data = json.loads(latest_optimization.ai_content)
                    enhanced_desc = optimization_data.get('enhanced_description', '')
                    current_desc = product.description or ''
                    
                    patch_needed = enhanced_desc != current_desc
                    
                    patch_status.append({
                        'product_id': product.id,
                        'product_name': product.name,
                        'patch_needed': patch_needed,
                        'current_description_length': len(current_desc),
                        'enhanced_description_length': len(enhanced_desc),
                        'optimization_date': latest_optimization.created_at.isoformat(),
                        'current_description_preview': current_desc[:100] + '...' if len(current_desc) > 100 else current_desc,
                        'enhanced_description_preview': enhanced_desc[:100] + '...' if len(enhanced_desc) > 100 else enhanced_desc
                    })
            
            # Summary stats
            total_optimized = len(patch_status)
            needs_patching = len([p for p in patch_status if p['patch_needed']])
            already_patched = total_optimized - needs_patching
            
            return {
                'success': True,
                'summary': {
                    'total_optimized_products': total_optimized,
                    'needs_patching': needs_patching,
                    'already_patched': already_patched
                },
                'products': patch_status
            }
            
        except Exception as e:
            logger.error(f"Patch status check failed: {e}")
            return {'error': 'Failed to check patch status', 'details': str(e)}, 500

class AdminBatchOptimizationAPI(Resource):
    """Admin endpoint for batch product optimization"""
    
    def post(self):
        """Batch optimize multiple products"""
        parser = reqparse.RequestParser()
        parser.add_argument('category_id', type=int, required=False)
        parser.add_argument('limit', type=int, default=10)
        parser.add_argument('product_ids', type=list, location='json', required=False)
        args = parser.parse_args()
        
        try:
            if args.get('product_ids'):
                # Optimize specific products
                results = []
                for product_id in args['product_ids']:
                    result = asyncio.run(intelligent_optimizer.analyze_and_optimize_product(product_id))
                    results.append(result)
                
                return {
                    'success': True,
                    'optimized_count': len([r for r in results if r.get('success')]),
                    'results': results
                }
            else:
                # Batch optimize by category
                result = asyncio.run(
                    intelligent_optimizer.batch_optimize_products(
                        category_id=args.get('category_id'),
                        limit=args['limit']
                    )
                )
                return result
                
        except Exception as e:
            logger.error(f"Batch optimization failed: {e}")
            return {'error': 'Batch optimization failed', 'details': str(e)}, 500

class AdminAIAnalyticsAPI(Resource):
    """Admin analytics for AI optimization performance"""
    
    def get(self):
        """Get comprehensive AI analytics dashboard data"""
        parser = reqparse.RequestParser()
        parser.add_argument('days', type=int, default=30, location='args')
        parser.add_argument('category_id', type=int, required=False, location='args')
        args = parser.parse_args()
        
        try:
            start_date = datetime.utcnow() - timedelta(days=args['days'])
            
            # AI Usage Analytics
            usage_query = AIUsageAnalytics.query.filter(
                AIUsageAnalytics.created_at >= start_date
            )
            
            if args.get('category_id'):
                # Filter by category products
                category_products = Product.query.filter_by(category_id=args['category_id']).all()
                product_ids = [p.id for p in category_products]
                usage_query = usage_query.filter(AIUsageAnalytics.entity_id.in_(product_ids))
            
            usage_data = usage_query.all()
            
            # Optimization Statistics
            optimizations_query = AIGeneratedContent.query.filter(
                AIGeneratedContent.content_type == 'intelligent_optimization',
                AIGeneratedContent.created_at >= start_date
            )
            optimizations = optimizations_query.all()
            
            # SEO Performance
            seo_metadata = SEOMetadata.query.filter(
                SEOMetadata.is_ai_generated == True,
                SEOMetadata.updated_at >= start_date
            ).all()
            
            # Calculate metrics
            total_optimizations = len(optimizations)
            total_cost = sum(u.cost_cents for u in usage_data) / 100
            total_tokens = sum(u.tokens_total for u in usage_data)
            avg_response_time = sum(u.response_time_ms for u in usage_data) / len(usage_data) if usage_data else 0
            
            # Products with optimizations
            optimized_products = set(o.entity_id for o in optimizations)
            total_products = Product.query.count()
            optimization_coverage = (len(optimized_products) / total_products * 100) if total_products > 0 else 0
            
            # Category breakdown
            category_stats = {}
            for category in Category.query.all():
                category_products = Product.query.filter_by(category_id=category.id).all()
                category_optimizations = [o for o in optimizations if o.entity_id in [p.id for p in category_products]]
                
                category_stats[category.name] = {
                    'total_products': len(category_products),
                    'optimized_products': len(set(o.entity_id for o in category_optimizations)),
                    'optimization_rate': (len(set(o.entity_id for o in category_optimizations)) / len(category_products) * 100) if category_products else 0,
                    'total_cost': sum(u.cost_cents for u in usage_data if u.entity_id in [p.id for p in category_products]) / 100
                }
            
            # Recent optimizations
            recent_optimizations = AIGeneratedContent.query.filter(
                AIGeneratedContent.content_type == 'intelligent_optimization'
            ).order_by(AIGeneratedContent.created_at.desc()).limit(10).all()
            
            recent_data = []
            for opt in recent_optimizations:
                product = Product.query.get(opt.entity_id)
                recent_data.append({
                    'product_name': product.name if product else 'Unknown',
                    'product_id': opt.entity_id,
                    'optimization_date': opt.created_at.isoformat(),
                    'tokens_used': opt.tokens_used,
                    'processing_time_ms': opt.generation_time_ms,
                    'quality_score': opt.quality_score
                })
            
            return {
                'success': True,
                'period_days': args['days'],
                'summary': {
                    'total_optimizations': total_optimizations,
                    'total_cost_dollars': total_cost,
                    'total_tokens': total_tokens,
                    'average_response_time_ms': avg_response_time,
                    'optimization_coverage_percent': optimization_coverage,
                    'optimized_products_count': len(optimized_products),
                    'total_products_count': total_products
                },
                'category_breakdown': category_stats,
                'recent_optimizations': recent_data,
                'seo_improvements': {
                    'ai_generated_meta_tags': len(seo_metadata),
                    'average_meta_title_length': sum(len(s.meta_title or '') for s in seo_metadata) / len(seo_metadata) if seo_metadata else 0,
                    'average_meta_description_length': sum(len(s.meta_description or '') for s in seo_metadata) / len(seo_metadata) if seo_metadata else 0
                }
            }
            
        except Exception as e:
            logger.error(f"Analytics retrieval failed: {e}")
            return {'error': 'Failed to retrieve analytics'}, 500

class AdminSEOPerformanceAPI(Resource):
    """Admin SEO performance tracking and crawler analytics"""
    
    def get(self):
        """Get SEO performance metrics and crawler recognition data"""
        try:
            # All products with AI optimizations
            optimized_products = db.session.query(Product).join(
                SEOMetadata, Product.id == SEOMetadata.entity_id
            ).filter(SEOMetadata.is_ai_generated == True).all()
            
            # SEO metadata performance
            seo_performance = []
            for product in optimized_products:
                seo_data = SEOMetadata.query.filter_by(
                    page_type='product',
                    entity_id=product.id,
                    is_ai_generated=True
                ).first()
                
                if seo_data:
                    seo_performance.append({
                        'product_id': product.id,
                        'product_name': product.name,
                        'meta_title': seo_data.meta_title,
                        'meta_description': seo_data.meta_description,
                        'meta_keywords': seo_data.meta_keywords,
                        'title_length': len(seo_data.meta_title or ''),
                        'description_length': len(seo_data.meta_description or ''),
                        'keyword_count': len((seo_data.meta_keywords or '').split(',')) if seo_data.meta_keywords else 0,
                        'optimization_date': seo_data.updated_at.isoformat() if seo_data.updated_at else None,
                        'performance_score': seo_data.performance_score or 0,
                        'impressions': seo_data.impressions or 0,
                        'clicks': seo_data.clicks or 0,
                        'ctr': (seo_data.clicks / seo_data.impressions * 100) if seo_data.impressions and seo_data.impressions > 0 else 0
                    })
            
            # SEO health metrics
            seo_health = {
                'total_optimized_products': len(optimized_products),
                'average_title_length': sum(p['title_length'] for p in seo_performance) / len(seo_performance) if seo_performance else 0,
                'average_description_length': sum(p['description_length'] for p in seo_performance) / len(seo_performance) if seo_performance else 0,
                'optimal_title_count': len([p for p in seo_performance if 50 <= p['title_length'] <= 60]),
                'optimal_description_count': len([p for p in seo_performance if 150 <= p['description_length'] <= 160]),
                'total_impressions': sum(p['impressions'] for p in seo_performance),
                'total_clicks': sum(p['clicks'] for p in seo_performance),
                'average_ctr': sum(p['ctr'] for p in seo_performance) / len(seo_performance) if seo_performance else 0
            }
            
            # Top performing products by SEO metrics
            top_performers = sorted(seo_performance, key=lambda x: x['ctr'], reverse=True)[:10]
            
            return {
                'success': True,
                'seo_health': seo_health,
                'top_performers': top_performers,
                'all_products': seo_performance,
                'recommendations': self._generate_seo_recommendations(seo_performance)
            }
            
        except Exception as e:
            logger.error(f"SEO performance retrieval failed: {e}")
            return {'error': 'Failed to retrieve SEO performance'}, 500
    
    def _generate_seo_recommendations(self, seo_data):
        """Generate SEO improvement recommendations"""
        recommendations = []
        
        if not seo_data:
            return ["No optimized products found. Start optimizing products to get recommendations."]
        
        # Title length recommendations
        short_titles = [p for p in seo_data if p['title_length'] < 50]
        long_titles = [p for p in seo_data if p['title_length'] > 60]
        
        if short_titles:
            recommendations.append(f"{len(short_titles)} products have titles that are too short (under 50 characters). Consider expanding them.")
        
        if long_titles:
            recommendations.append(f"{len(long_titles)} products have titles that are too long (over 60 characters). Consider shortening them.")
        
        # Description length recommendations
        short_descriptions = [p for p in seo_data if p['description_length'] < 150]
        long_descriptions = [p for p in seo_data if p['description_length'] > 160]
        
        if short_descriptions:
            recommendations.append(f"{len(short_descriptions)} products have descriptions that are too short. Expand them for better SEO.")
        
        if long_descriptions:
            recommendations.append(f"{len(long_descriptions)} products have descriptions that are too long. Shorten them to avoid truncation.")
        
        # Performance recommendations
        low_ctr_products = [p for p in seo_data if p['impressions'] > 100 and p['ctr'] < 2]
        if low_ctr_products:
            recommendations.append(f"{len(low_ctr_products)} products have low click-through rates. Consider improving their titles and descriptions.")
        
        if not recommendations:
            recommendations.append("Great job! Your SEO optimization is performing well. Keep monitoring and optimizing regularly.")
        
        return recommendations