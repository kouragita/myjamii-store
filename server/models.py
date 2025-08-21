from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users' 

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False) 
    email = db.Column(db.String, unique=True, nullable=False)     
    password = db.Column(db.String, nullable=False)                
    role = db.Column(db.String, default='user')                   
    carts = db.relationship('Cart', backref='user', lazy=True)

    def __repr__(self): 
        return f"<User  {self.username}, Role {self.role}>"

class Product(db.Model):
    __tablename__ = 'products'  

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)                    
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String, nullable=True)                
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    category = db.relationship('Category', backref='products')

    def __repr__(self):  
        return f"<Product {self.name}>"

class Cart(db.Model):
    __tablename__ = 'carts'  

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  
    items = db.relationship('CartItem', backref='cart', lazy=True)

    def __repr__(self): 
        return f"<Cart {self.id} for User {self.user_id}>"

class CartItem(db.Model):
    __tablename__ = 'cart_items'  

    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    product = db.relationship('Product')

    def __repr__(self):  
        return f"<CartItem {self.product.name} (x{self.quantity})>"

class Category(db.Model):
    __tablename__ = 'categories'  

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)                    
    description = db.Column(db.Text, nullable=True)

    def __repr__(self):  
        return f"<Category {self.name}>"

class ProductCategory(db.Model):
    __tablename__ = 'product_categories' 

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    def __repr__(self):  
        return f"<ProductCategory product_id={self.product_id}, category_id={self.category_id}>"


# AI-related models for content generation and analytics

class AIGeneratedContent(db.Model):
    """Store AI-generated content with analytics and caching"""
    __tablename__ = 'ai_generated_content'
    
    id = db.Column(db.Integer, primary_key=True)
    content_type = db.Column(db.String(50), nullable=False)  # 'product_desc', 'meta_title', 'meta_desc'
    entity_type = db.Column(db.String(50), nullable=False)   # 'product', 'category', 'page'
    entity_id = db.Column(db.Integer, nullable=True)         # product_id, category_id, etc.
    original_content = db.Column(db.Text)
    ai_content = db.Column(db.Text, nullable=False)
    model_used = db.Column(db.String(50), default='mixtral-8x7b-32768')
    tokens_used = db.Column(db.Integer, default=0)
    generation_time_ms = db.Column(db.Integer, default=0)
    quality_score = db.Column(db.Float, default=0.0)         # Performance metric
    usage_count = db.Column(db.Integer, default=0)           # Track how often accessed
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<AIGeneratedContent {self.content_type} for {self.entity_type}:{self.entity_id}>"
    
    def to_dict(self):
        return {
            'id': self.id,
            'content_type': self.content_type,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'ai_content': self.ai_content,
            'model_used': self.model_used,
            'tokens_used': self.tokens_used,
            'generation_time_ms': self.generation_time_ms,
            'quality_score': self.quality_score,
            'usage_count': self.usage_count,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class SEOMetadata(db.Model):
    """Store SEO metadata with AI enhancement tracking"""
    __tablename__ = 'seo_metadata'
    
    id = db.Column(db.Integer, primary_key=True)
    page_type = db.Column(db.String(50), nullable=False)     # 'homepage', 'product', 'category'
    entity_id = db.Column(db.Integer, nullable=True)         # product_id, category_id (null for homepage)
    meta_title = db.Column(db.String(200))
    meta_description = db.Column(db.String(300))
    meta_keywords = db.Column(db.Text)
    structured_data = db.Column(db.JSON)                     # JSON-LD schema
    is_ai_generated = db.Column(db.Boolean, default=False)
    performance_score = db.Column(db.Float, default=0.0)     # SEO performance metric
    click_through_rate = db.Column(db.Float, default=0.0)
    impressions = db.Column(db.Integer, default=0)
    clicks = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<SEOMetadata {self.page_type}:{self.entity_id}>"
    
    def to_dict(self):
        return {
            'id': self.id,
            'page_type': self.page_type,
            'entity_id': self.entity_id,
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'meta_keywords': self.meta_keywords,
            'structured_data': self.structured_data,
            'is_ai_generated': self.is_ai_generated,
            'performance_score': self.performance_score,
            'click_through_rate': self.click_through_rate,
            'impressions': self.impressions,
            'clicks': self.clicks,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class AIUsageAnalytics(db.Model):
    """Track AI API usage for cost analysis and performance monitoring"""
    __tablename__ = 'ai_usage_analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    endpoint = db.Column(db.String(100), nullable=False)     # '/ai/generate-description'
    request_type = db.Column(db.String(50), nullable=False)  # 'product_description', 'meta_tags'
    entity_type = db.Column(db.String(50))                   # 'product', 'category'
    entity_id = db.Column(db.Integer)                        # product_id, category_id
    tokens_input = db.Column(db.Integer, default=0)
    tokens_output = db.Column(db.Integer, default=0)
    tokens_total = db.Column(db.Integer, default=0)
    response_time_ms = db.Column(db.Integer, default=0)
    success = db.Column(db.Boolean, default=True)
    error_message = db.Column(db.Text)
    cost_cents = db.Column(db.Float, default=0.0)            # Track API costs in cents
    model_used = db.Column(db.String(50), default='mixtral-8x7b-32768')
    user_ip = db.Column(db.String(45))                       # For tracking (optional)
    user_agent = db.Column(db.String(500))                   # For analytics
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<AIUsageAnalytics {self.endpoint} - {self.success}>"
    
    def to_dict(self):
        return {
            'id': self.id,
            'endpoint': self.endpoint,
            'request_type': self.request_type,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'tokens_input': self.tokens_input,
            'tokens_output': self.tokens_output,
            'tokens_total': self.tokens_total,
            'response_time_ms': self.response_time_ms,
            'success': self.success,
            'error_message': self.error_message,
            'cost_cents': self.cost_cents,
            'model_used': self.model_used,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class AIPerformanceMetrics(db.Model):
    """Track AI-generated content performance for optimization"""
    __tablename__ = 'ai_performance_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    content_id = db.Column(db.Integer, db.ForeignKey('ai_generated_content.id'), nullable=False)
    metric_type = db.Column(db.String(50), nullable=False)   # 'engagement', 'conversion', 'seo_rank'
    metric_value = db.Column(db.Float, nullable=False)
    baseline_value = db.Column(db.Float, default=0.0)        # Original content performance
    improvement_percent = db.Column(db.Float, default=0.0)
    measurement_period_days = db.Column(db.Integer, default=30)
    notes = db.Column(db.Text)
    measured_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    ai_content = db.relationship('AIGeneratedContent', backref='performance_metrics')
    
    def __repr__(self):
        return f"<AIPerformanceMetrics {self.metric_type}: {self.metric_value}>"