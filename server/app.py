from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from models import db, User, Product, Cart, CartItem, Category, AIGeneratedContent, SEOMetadata, AIUsageAnalytics
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_migrate import Migrate
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
api = Api(app)
CORS(app)

# Database configuration from environment
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS', 'False').lower() == 'true'


migrate = Migrate(app, db)
db.init_app(app)

class UserLoginAPI(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        args = parser.parse_args()

        user = User.query.filter_by(username=args['username']).first()
        if user and check_password_hash(user.password, args['password']):
            return jsonify({
                'message': 'User  logged in successfully',
                'user': {'id': user.id, 'username': user.username, 'role': user.role}
            })
        return jsonify({'error': 'Invalid username or password'}), 401

class UserSignupAPI(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str, required=True)
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        args = parser.parse_args()

        if User.query.filter_by(username=args['username']).first():
            return jsonify({'error': 'Username already exists'}), 400

        user = User(
            username=args['username'],
            email=args['email'],
            password=generate_password_hash(args['password']),
            role='user'
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({
            'message': 'User  created successfully',
            'user': {'id': user.id, 'username': user.username, 'role': user.role}
        })

class ProductAPI(Resource):
    def get(self, category_id=None):
        if category_id is None:
            products = Product.query.all()
        else:
            category = Category.query.get(category_id)
            if category is None:
                return jsonify({'error': 'Category not found'}), 404
            products = category.products

        output = [{
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'stock': product.stock,
            'image_url': product.image_url
        } for product in products]

        return jsonify({'products': output})
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('description', type=str)
        parser.add_argument('price', type=float, required=True)
        parser.add_argument('stock', type=int, required=True)
        parser.add_argument('image_url', type=str)
        parser.add_argument('category_id', type=int, required=True)
        args = parser.parse_args()

        
        if not Category.query.get(args['category_id']):
            return jsonify({'error': 'Category not found'}), 400

        new_product = Product(
            name=args['name'],
            description=args.get('description'),
            price=args['price'],
            stock=args['stock'],
            image_url=args.get('image_url'),
            category_id=args['category_id']
        )

        db.session.add(new_product)
        
        try:
            db.session.commit()
            return jsonify({
                'message': 'Product created successfully',
                'product': {'id': new_product.id, 'name': new_product.name}
            }), 201  
        except Exception as e:
            db.session.rollback()  
            return jsonify({'error': str(e)}), 500  
    def put(self, product_id):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('description', type=str)
        parser.add_argument('price', type=float)
        parser.add_argument('stock', type=int)
        parser.add_argument('image_url', type=str)
        parser.add_argument('category_id', type=int)
        args = parser.parse_args()

        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        if args['name'] is not None:
            product.name = args['name']
        if args['description'] is not None:
            product.description = args['description']
        if args['price'] is not None:
            product.price = args['price']
        if args['stock'] is not None:
            product.stock = args['stock']
        if args['image_url'] is not None:
            product.image_url = args['image_url']
        if args['category_id'] is not None:
            product.category_id = args['category_id']

        db.session.commit()
        return jsonify({'message': 'Product updated successfully'})

    def delete(self, product_id):
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'})

class StockReductionAPI(Resource):
    def post(self, product_id):
        parser = reqparse.RequestParser()
        parser.add_argument('quantity', type=int, required=True)
        args = parser.parse_args()

        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        if product.stock < args['quantity']:
            return jsonify({'error': 'Not enough stock available'}), 400

        product.stock -= args['quantity']
        db.session.commit()
        return jsonify({
            'message': 'Stock reduced successfully',
            'product_id': product.id,
            'remaining_stock': product.stock
        })

class CategoryAPI(Resource):
    def get(self):
        categories = Category.query.all()
        output = []
        for category in categories:
            product_count = Product.query.filter_by(category_id=category.id).count()
            output.append({
                'id': category.id, 
                'name': category.name, 
                'description': category.description,
                'product_count': product_count
            })
        return jsonify({'categories': output})

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('description', type=str)
        args = parser.parse_args()

        new_category = Category(name=args['name'], description=args.get('description'))
        db.session.add(new_category)
        db.session.commit()
        return jsonify({'message': 'Category created successfully', 'category': {'id': new_category.id, 'name': new_category.name}})

    def put(self, category_id):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('description', type=str)
        args = parser.parse_args()

        category = Category.query.get(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404

        if args['name'] is not None:
            category.name = args['name']
        if args['description'] is not None:
            category.description = args['description']

        db.session.commit()
        return jsonify({'message': 'Category updated successfully'})

    def delete(self, category_id):
        category = Category.query.get(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404

        db.session.delete(category)
        db.session.commit()
        return jsonify({'message': 'Category deleted successfully'})

class ProductSearchAPI(Resource):
    """Advanced product search using AI-generated meta tags and product data"""
    
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('q', type=str, required=True, help='Search query is required', location='args')
        parser.add_argument('category_id', type=int, required=False, location='args')
        parser.add_argument('limit', type=int, default=20, location='args')
        args = parser.parse_args()
        
        search_query = args['q'].lower().strip()
        
        try:
            # Base query
            query = Product.query
            
            # Filter by category if specified
            if args.get('category_id'):
                query = query.filter(Product.category_id == args['category_id'])
            
            # Get all products that might match
            all_products = query.all()
            
            # Search through products with AI meta tags
            matching_products = []
            
            for product in all_products:
                score = 0
                matched_sources = []
                
                # ENHANCED SEARCH: Search in product name (highest weight - 100)
                if search_query in product.name.lower():
                    score += 100
                    matched_sources.append('product_name')
                
                # ENHANCED SEARCH: Search in product description (high weight - 80)
                if product.description and search_query in product.description.lower():
                    score += 80
                    matched_sources.append('product_description')
                
                # NEW: Search AI-generated keywords from AIGeneratedContent (very high weight - 120)
                ai_content = AIGeneratedContent.query.filter_by(
                    content_type='intelligent_optimization',
                    entity_type='product',
                    entity_id=product.id,
                    is_active=True
                ).first()
                
                if ai_content:
                    try:
                        import json
                        ai_data = json.loads(ai_content.ai_content)
                        
                        # Search in AI keywords (very high weight)
                        ai_keywords = ai_data.get('keywords', '')
                        if ai_keywords and search_query in ai_keywords.lower():
                            score += 120
                            matched_sources.append('ai_keywords')
                        
                        # Search in enhanced description (high weight)
                        enhanced_desc = ai_data.get('enhanced_description', '')
                        if enhanced_desc and search_query in enhanced_desc.lower():
                            score += 90
                            matched_sources.append('ai_enhanced_description')
                        
                        # Search in AI meta title (medium-high weight)
                        meta_title = ai_data.get('meta_title', '')
                        if meta_title and search_query in meta_title.lower():
                            score += 70
                            matched_sources.append('ai_meta_title')
                        
                        # Search in AI meta description (medium weight)
                        meta_desc = ai_data.get('meta_description', '')
                        if meta_desc and search_query in meta_desc.lower():
                            score += 60
                            matched_sources.append('ai_meta_description')
                        
                    except (json.JSONDecodeError, AttributeError) as e:
                        pass  # Skip if JSON parsing fails
                
                # NEW: Search SEO metadata (high weight - 110)
                seo_metadata = SEOMetadata.query.filter_by(
                    page_type='product',
                    entity_id=product.id,
                    is_ai_generated=True,
                    is_active=True
                ).first()
                
                if seo_metadata:
                    # Search in SEO keywords (very high weight)
                    if seo_metadata.meta_keywords and search_query in seo_metadata.meta_keywords.lower():
                        score += 110
                        matched_sources.append('seo_keywords')
                    
                    # Search in SEO meta title (medium-high weight)
                    if seo_metadata.meta_title and search_query in seo_metadata.meta_title.lower():
                        score += 65
                        matched_sources.append('seo_meta_title')
                    
                    # Search in SEO meta description (medium weight)
                    if seo_metadata.meta_description and search_query in seo_metadata.meta_description.lower():
                        score += 55
                        matched_sources.append('seo_meta_description')
                
                # ENHANCED: Partial matches (fuzzy search) with AI content
                search_words = search_query.split()
                for word in search_words:
                    if len(word) > 2:  # Only check words longer than 2 characters
                        # Product name partial match
                        if word in product.name.lower():
                            score += 25
                        
                        # Product description partial match
                        if product.description and word in product.description.lower():
                            score += 15
                        
                        # AI keywords partial match
                        if ai_content:
                            try:
                                ai_data = json.loads(ai_content.ai_content)
                                ai_keywords = ai_data.get('keywords', '')
                                if ai_keywords and word in ai_keywords.lower():
                                    score += 30
                                
                                enhanced_desc = ai_data.get('enhanced_description', '')
                                if enhanced_desc and word in enhanced_desc.lower():
                                    score += 20
                            except (json.JSONDecodeError, AttributeError):
                                pass
                        
                        # SEO keywords partial match
                        if seo_metadata and seo_metadata.meta_keywords and word in seo_metadata.meta_keywords.lower():
                            score += 35
                
                # If product has any relevance, add to results
                if score > 0:
                    matching_products.append({
                        'product': product,
                        'score': score,
                        'matched_sources': matched_sources,
                        'ai_enhanced': bool(ai_content or seo_metadata)
                    })
            
            # Sort by relevance score (highest first)
            matching_products.sort(key=lambda x: x['score'], reverse=True)
            
            # Limit results
            matching_products = matching_products[:args['limit']]
            
            # Format output
            output = []
            for item in matching_products:
                product = item['product']
                
                output.append({
                    'id': product.id,
                    'name': product.name,
                    'description': product.description,
                    'price': product.price,
                    'stock': product.stock,
                    'image_url': product.image_url,
                    'category_id': product.category_id,
                    'relevance_score': item['score'],
                    'matched_sources': item['matched_sources'],
                    'ai_enhanced': item['ai_enhanced']
                })
            
            return jsonify({
                'products': output,
                'total_results': len(matching_products),
                'search_query': args['q'],
                'ai_search_enabled': True
            })
            
        except Exception as e:
            import logging
            logging.error(f"Search failed: {e}")
            return jsonify({'error': 'Search failed', 'details': str(e)}), 500

# Import AI routes
from routes.ai_routes import (
    AIProductDescriptionAPI, 
    AIProductMetaTagsAPI, 
    AICategoryMetaTagsAPI, 
    AIBatchGenerationAPI, 
    AIAnalyticsAPI
)

# Import SEO routes
from routes.seo_routes import (
    SEOProductPageAPI,
    SEOCategoryPageAPI,
    SEOHomepageAPI,
    DynamicSitemapAPI,
    RobotsTxtAPI
)

# Import Admin AI routes
from routes.admin_ai_routes import (
    AdminProductOptimizationAPI,
    AdminProductPatchAPI,
    AdminPatchStatusAPI,
    AdminBatchOptimizationAPI,
    AdminAIAnalyticsAPI,
    AdminSEOPerformanceAPI
)

# Original API routes
api.add_resource(CategoryAPI, '/categories', '/categories/<int:category_id>')
api.add_resource(UserLoginAPI, '/login')
api.add_resource(UserSignupAPI, '/signup')
api.add_resource(ProductAPI, '/products', '/products/category/<int:category_id>', '/products/<int:product_id>')
api.add_resource(ProductSearchAPI, '/products/search')
api.add_resource(StockReductionAPI, '/products/<int:product_id>/reduce_stock')

# AI-powered API routes
api.add_resource(AIProductDescriptionAPI, '/ai/products/<int:product_id>/description')
api.add_resource(AIProductMetaTagsAPI, '/ai/products/<int:product_id>/meta-tags')
api.add_resource(AICategoryMetaTagsAPI, '/ai/categories/<int:category_id>/meta-tags')
api.add_resource(AIBatchGenerationAPI, '/ai/batch-generate')
api.add_resource(AIAnalyticsAPI, '/ai/analytics')

# SEO server-side rendering routes (for crawlers)
api.add_resource(SEOProductPageAPI, '/seo/products/<int:product_id>')
api.add_resource(SEOCategoryPageAPI, '/seo/categories/<int:category_id>')
api.add_resource(SEOHomepageAPI, '/seo/homepage')
api.add_resource(DynamicSitemapAPI, '/sitemap.xml')
api.add_resource(RobotsTxtAPI, '/robots.txt')

# Admin AI routes (for admin dashboard control)
api.add_resource(AdminProductOptimizationAPI, '/admin/ai/products/<int:product_id>/optimize')
api.add_resource(AdminProductPatchAPI, '/admin/ai/products/<int:product_id>/patch')
api.add_resource(AdminPatchStatusAPI, '/admin/ai/patch-status')
api.add_resource(AdminBatchOptimizationAPI, '/admin/ai/batch-optimize')
api.add_resource(AdminAIAnalyticsAPI, '/admin/ai/analytics')
api.add_resource(AdminSEOPerformanceAPI, '/admin/ai/seo-performance')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5555))
    app.run(host="0.0.0.0", port=port, debug=True)