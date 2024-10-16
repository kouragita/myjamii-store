from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

# Initialize SQLAlchemy and Marshmallow instances
db = SQLAlchemy()
ma = Marshmallow()

# Import all models here to resolve dependencies
from .user import User
from .order import Order
from .product import Product
from .product_category import ProductCategory
from .shopping_cart import ShoppingCart
from .payment import Payment

def configure_mappers():
    User.orders = db.relationship('Order', back_populates='user')

# Call configure_mappers to set up relationships
configure_mappers()

__all__ = ['db', 'ma', 'User', 'Order', 'Product', 'ProductCategory', 'ShoppingCart', 'Payment']


