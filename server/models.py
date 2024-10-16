from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'  # Corrected here
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    carts = db.relationship('Cart', backref='user', lazy=True)
    
    def __repr__(self):
        return f"<User  {self.username}>"

class Product(db.Model):
    __tablename__ = 'products'  # Corrected here
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    
    def __repr__(self):
        return f"<Product {self.name}>"

class Cart(db.Model):
    __tablename__ = 'carts'  # Corrected here
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    items = db.relationship('CartItem', backref='cart', lazy=True)
    
    def __repr__(self):
        return f"<Cart {self.id} for User {self.user_id}>"

class CartItem(db.Model):
    __tablename__ = 'cart_items'  # Corrected here
    
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    
    product = db.relationship('Product')

    def __repr__(self):
        return f"<CartItem {self.product.name} (x{self.quantity})>"