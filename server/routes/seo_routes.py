"""
SEO Server-Side Rendering Routes - Detect crawlers and serve optimized HTML
"""
import re
import asyncio
from flask import request, render_template_string, jsonify, make_response
from flask_restful import Resource
from models import db, Product, Category, SEOMetadata, AIGeneratedContent
from services.groq_ai_service import groq_service
import logging

logger = logging.getLogger(__name__)

# Common search engine crawler user agents
CRAWLER_PATTERNS = [
    r'googlebot',
    r'bingbot',
    r'slurp',  # Yahoo
    r'duckduckbot',
    r'baiduspider',
    r'yandexbot',
    r'facebookexternalhit',
    r'twitterbot',
    r'linkedinbot',
    r'whatsapp',
    r'telegrambot'
]

def is_crawler(user_agent):
    """Detect if request is from a search engine crawler"""
    if not user_agent:
        return False
    
    user_agent_lower = user_agent.lower()
    return any(re.search(pattern, user_agent_lower) for pattern in CRAWLER_PATTERNS)

def generate_structured_data(entity_type, entity_data):
    """Generate JSON-LD structured data"""
    base_url = "https://myjamii-store-client.onrender.com"
    
    if entity_type == 'product':
        return {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": entity_data.get('name', ''),
            "description": entity_data.get('description', ''),
            "brand": {
                "@type": "Brand",
                "name": "Myjamii Store"
            },
            "offers": {
                "@type": "Offer",
                "price": entity_data.get('price', 0),
                "priceCurrency": "USD",
                "availability": "InStock" if entity_data.get('stock', 0) > 0 else "OutOfStock",
                "seller": {
                    "@type": "Organization",
                    "name": "Myjamii Store",
                    "url": base_url
                }
            },
            "image": entity_data.get('image_url', f"{base_url}/images/placeholder.jpg"),
            "category": entity_data.get('category', "General"),
            "sku": f"MYJ-{entity_data.get('id', '')}",
            "url": f"{base_url}/products/{entity_data.get('id', '')}"
        }
    
    elif entity_type == 'organization':
        return {
            "@context": "https://schema.org/",
            "@type": "Organization",
            "name": "Myjamii Store",
            "description": "Premium online store offering electronics, clothing, books, home appliances, and sports equipment",
            "url": base_url,
            "logo": f"{base_url}/images/logo.png",
            "sameAs": [
                "https://www.facebook.com/myjamiistore",
                "https://www.twitter.com/myjamiistore",
                "https://www.instagram.com/myjamiistore"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-MYJAMII",
                "contactType": "customer service",
                "email": "hello@myjamii.com"
            }
        }
    
    return {}

class SEOProductPageAPI(Resource):
    """Serve SEO-optimized product pages for crawlers"""
    
    def get(self, product_id):
        """Serve product page with AI-enhanced SEO"""
        user_agent = request.headers.get('User-Agent', '')
        
        if not is_crawler(user_agent):
            # Regular users get the React SPA
            return {'redirect': f'https://myjamii-store-client.onrender.com/products/{product_id}'}, 302
        
        try:
            # Get product data
            product = Product.query.get(product_id)
            if not product:
                return {'error': 'Product not found'}, 404
            
            # Get AI-enhanced SEO data
            seo_data = SEOMetadata.query.filter_by(
                page_type='product',
                entity_id=product_id,
                is_active=True
            ).first()
            
            # Get AI-enhanced description
            ai_content = AIGeneratedContent.query.filter_by(
                content_type='product_description',
                entity_type='product',
                entity_id=product_id,
                is_active=True
            ).first()
            
            # Use AI content if available, otherwise fallback
            description = ai_content.ai_content if ai_content else product.description
            title = seo_data.meta_title if seo_data else f"{product.name} | Myjamii Store"
            meta_description = seo_data.meta_description if seo_data else f"Buy {product.name} for ${product.price}. High-quality products at Myjamii Store."
            keywords = seo_data.meta_keywords if seo_data else f"{product.name}, buy online, e-commerce"
            
            # Prepare product data for structured data
            product_data = {
                'id': product.id,
                'name': product.name,
                'description': description,
                'price': product.price,
                'stock': product.stock,
                'image_url': product.image_url,
                'category': product.category.name if product.category else 'General'
            }
            
            structured_data = generate_structured_data('product', product_data)
            
            # Generate HTML for crawler
            html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <meta name="description" content="{{ meta_description }}">
    <meta name="keywords" content="{{ keywords }}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="product">
    <meta property="og:title" content="{{ title }}">
    <meta property="og:description" content="{{ meta_description }}">
    <meta property="og:url" content="https://myjamii-store-client.onrender.com/products/{{ product.id }}">
    <meta property="og:site_name" content="Myjamii Store">
    <meta property="og:image" content="{{ product.image_url }}">
    <meta property="product:price:amount" content="{{ product.price }}">
    <meta property="product:price:currency" content="USD">
    <meta property="product:availability" content="{{ 'in stock' if product.stock > 0 else 'out of stock' }}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ title }}">
    <meta name="twitter:description" content="{{ meta_description }}">
    <meta name="twitter:image" content="{{ product.image_url }}">
    
    <!-- SEO -->
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="https://myjamii-store-client.onrender.com/products/{{ product.id }}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {{ structured_data | safe }}
    </script>
</head>
<body>
    <header>
        <h1>{{ product.name }} | Myjamii Store</h1>
    </header>
    
    <main>
        <article>
            <h1>{{ product.name }}</h1>
            <img src="{{ product.image_url }}" alt="{{ product.name }}" width="400" height="400">
            
            <div class="product-info">
                <p class="price">${{ product.price }}</p>
                <p class="category">Category: {{ product.category.name if product.category else 'General' }}</p>
                <p class="availability">{{ 'In Stock' if product.stock > 0 else 'Out of Stock' }}</p>
            </div>
            
            <div class="description">
                <h2>Product Description</h2>
                <p>{{ description }}</p>
            </div>
            
            <div class="ai-enhanced" style="display:none;">
                <!-- AI Enhanced Content Marker for Analytics -->
                <span data-ai-enhanced="{{ ai_content is not none }}"></span>
                <span data-seo-optimized="{{ seo_data is not none }}"></span>
            </div>
        </article>
    </main>
    
    <footer>
        <p>&copy; 2025 Myjamii Store. All rights reserved.</p>
        <p>Premium products with fast shipping and excellent customer service.</p>
    </footer>
</body>
</html>
            """
            
            import json
            rendered_html = render_template_string(
                html_template,
                title=title,
                meta_description=meta_description,
                keywords=keywords,
                product=product,
                description=description,
                structured_data=json.dumps(structured_data, indent=2),
                ai_content=ai_content,
                seo_data=seo_data
            )
            
            response = make_response(rendered_html)
            response.headers['Content-Type'] = 'text/html'
            
            # Log crawler visit for analytics
            logger.info(f"Served SEO page to crawler: {user_agent} for product {product_id}")
            
            return response
            
        except Exception as e:
            logger.error(f"SEO page generation failed: {e}")
            return {'error': 'Failed to generate SEO page'}, 500


class SEOCategoryPageAPI(Resource):
    """Serve SEO-optimized category pages for crawlers"""
    
    def get(self, category_id):
        """Serve category page with AI-enhanced SEO"""
        user_agent = request.headers.get('User-Agent', '')
        
        if not is_crawler(user_agent):
            return {'redirect': f'https://myjamii-store-client.onrender.com/products?category={category_id}'}, 302
        
        try:
            category = Category.query.get(category_id)
            if not category:
                return {'error': 'Category not found'}, 404
            
            # Get products in this category
            products = Product.query.filter_by(category_id=category_id).limit(10).all()
            
            # Get AI-enhanced SEO data
            seo_data = SEOMetadata.query.filter_by(
                page_type='category',
                entity_id=category_id,
                is_active=True
            ).first()
            
            title = seo_data.meta_title if seo_data else f"{category.name} | Myjamii Store"
            meta_description = seo_data.meta_description if seo_data else f"Shop premium {category.name.lower()} at Myjamii Store. Quality items with fast shipping."
            keywords = seo_data.meta_keywords if seo_data else f"{category.name.lower()}, online shopping, e-commerce"
            
            html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <meta name="description" content="{{ meta_description }}">
    <meta name="keywords" content="{{ keywords }}">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="{{ title }}">
    <meta property="og:description" content="{{ meta_description }}">
    <meta property="og:url" content="https://myjamii-store-client.onrender.com/products?category={{ category.id }}">
    
    <!-- SEO -->
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://myjamii-store-client.onrender.com/products?category={{ category.id }}">
</head>
<body>
    <header>
        <h1>{{ category.name }} | Myjamii Store</h1>
    </header>
    
    <main>
        <h1>{{ category.name }}</h1>
        <p>{{ category.description or 'Premium ' + category.name.lower() + ' products at Myjamii Store.' }}</p>
        
        <section class="products">
            <h2>Featured {{ category.name }} Products</h2>
            {% for product in products %}
            <article class="product">
                <h3>{{ product.name }}</h3>
                <p>${{ product.price }}</p>
                <p>{{ product.description[:100] }}...</p>
            </article>
            {% endfor %}
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 Myjamii Store. All rights reserved.</p>
    </footer>
</body>
</html>
            """
            
            rendered_html = render_template_string(
                html_template,
                title=title,
                meta_description=meta_description,
                keywords=keywords,
                category=category,
                products=products,
                seo_data=seo_data
            )
            
            response = make_response(rendered_html)
            response.headers['Content-Type'] = 'text/html'
            
            logger.info(f"Served SEO category page to crawler: {user_agent} for category {category_id}")
            
            return response
            
        except Exception as e:
            logger.error(f"SEO category page generation failed: {e}")
            return {'error': 'Failed to generate SEO page'}, 500


class SEOHomepageAPI(Resource):
    """Serve SEO-optimized homepage for crawlers"""
    
    def get(self):
        """Serve homepage with AI-enhanced SEO"""
        user_agent = request.headers.get('User-Agent', '')
        
        if not is_crawler(user_agent):
            return {'redirect': 'https://myjamii-store-client.onrender.com'}, 302
        
        try:
            # Get featured products and categories
            featured_products = Product.query.limit(8).all()
            categories = Category.query.all()
            
            # Get AI-enhanced SEO data for homepage
            seo_data = SEOMetadata.query.filter_by(
                page_type='homepage',
                entity_id=None,
                is_active=True
            ).first()
            
            title = seo_data.meta_title if seo_data else "Myjamii Store - Premium Electronics, Clothing & More | Shop Online"
            meta_description = seo_data.meta_description if seo_data else "Discover premium products across electronics, clothing, books, home appliances & sports. Fast shipping, quality guarantee at Myjamii Store."
            keywords = seo_data.meta_keywords if seo_data else "online shopping, electronics, clothing, books, home appliances, sports equipment"
            
            structured_data = generate_structured_data('organization', {})
            
            html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <meta name="description" content="{{ meta_description }}">
    <meta name="keywords" content="{{ keywords }}">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="{{ title }}">
    <meta property="og:description" content="{{ meta_description }}">
    <meta property="og:url" content="https://myjamii-store-client.onrender.com">
    <meta property="og:site_name" content="Myjamii Store">
    
    <!-- SEO -->
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://myjamii-store-client.onrender.com">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {{ structured_data | safe }}
    </script>
</head>
<body>
    <header>
        <h1>Myjamii Store - Premium Online Shopping</h1>
    </header>
    
    <main>
        <section class="hero">
            <h1>{{ title }}</h1>
            <p>{{ meta_description }}</p>
        </section>
        
        <section class="categories">
            <h2>Shop by Category</h2>
            {% for category in categories %}
            <div class="category">
                <h3>{{ category.name }}</h3>
                <p>{{ category.description or 'Premium ' + category.name.lower() + ' products' }}</p>
            </div>
            {% endfor %}
        </section>
        
        <section class="featured-products">
            <h2>Featured Products</h2>
            {% for product in featured_products %}
            <article class="product">
                <h3>{{ product.name }}</h3>
                <p>${{ product.price }}</p>
                <p>{{ (product.description or '')[:100] }}{% if product.description and product.description|length > 100 %}...{% endif %}</p>
            </article>
            {% endfor %}
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 Myjamii Store. All rights reserved.</p>
        <p>Premium products with fast shipping and excellent customer service.</p>
    </footer>
</body>
</html>
            """
            
            import json
            rendered_html = render_template_string(
                html_template,
                title=title,
                meta_description=meta_description,
                keywords=keywords,
                featured_products=featured_products,
                categories=categories,
                structured_data=json.dumps(structured_data, indent=2),
                seo_data=seo_data
            )
            
            response = make_response(rendered_html)
            response.headers['Content-Type'] = 'text/html'
            
            logger.info(f"Served SEO homepage to crawler: {user_agent}")
            
            return response
            
        except Exception as e:
            logger.error(f"SEO homepage generation failed: {e}")
            return {'error': 'Failed to generate SEO homepage'}, 500


class DynamicSitemapAPI(Resource):
    """Generate dynamic sitemap.xml from database"""
    
    def get(self):
        """Generate XML sitemap from current database content"""
        try:
            from datetime import datetime
            
            # Get all products and categories
            products = Product.query.all()
            categories = Category.query.all()
            
            base_url = "https://myjamii-store-client.onrender.com"
            current_date = datetime.utcnow().strftime('%Y-%m-%d')
            
            sitemap_template = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Homepage -->
    <url>
        <loc>{{ base_url }}/</loc>
        <lastmod>{{ current_date }}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    
    <!-- Products main page -->
    <url>
        <loc>{{ base_url }}/products</loc>
        <lastmod>{{ current_date }}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    
    <!-- About page -->
    <url>
        <loc>{{ base_url }}/about</loc>
        <lastmod>{{ current_date }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <!-- Category pages -->
    {% for category in categories %}
    <url>
        <loc>{{ base_url }}/products?category={{ category.id }}</loc>
        <lastmod>{{ current_date }}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    {% endfor %}
    
    <!-- Individual products -->
    {% for product in products %}
    <url>
        <loc>{{ base_url }}/products/{{ product.id }}</loc>
        <lastmod>{{ current_date }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    {% endfor %}
</urlset>"""
            
            sitemap_xml = render_template_string(
                sitemap_template,
                base_url=base_url,
                current_date=current_date,
                products=products,
                categories=categories
            )
            
            response = make_response(sitemap_xml)
            response.headers['Content-Type'] = 'application/xml'
            
            return response
            
        except Exception as e:
            logger.error(f"Sitemap generation failed: {e}")
            return {'error': 'Failed to generate sitemap'}, 500


class RobotsTxtAPI(Resource):
    """Generate robots.txt file"""
    
    def get(self):
        """Generate robots.txt with sitemap reference"""
        try:
            robots_content = """User-agent: *
Allow: /

# Sitemap
Sitemap: https://myjamii-store.onrender.com/sitemap.xml

# Crawl delay (optional - 1 second delay)
Crawl-delay: 1

# Specific bot instructions
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: facebookexternalhit/1.1
Allow: /

User-agent: Twitterbot
Allow: /
"""
            
            response = make_response(robots_content)
            response.headers['Content-Type'] = 'text/plain'
            
            return response
            
        except Exception as e:
            logger.error(f"Robots.txt generation failed: {e}")
            return {'error': 'Failed to generate robots.txt'}, 500