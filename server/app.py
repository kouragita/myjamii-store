from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from models import db, User, Product, Cart, CartItem, Category, ProductCategory
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
app = Flask(__name__)
api = Api(app)
CORS(app)
# Configurations
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

# Define API endpoints

class UserLoginAPI(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str)
        parser.add_argument('password', type=str)
        args = parser.parse_args()
        user = User.query.filter_by(username=args['username']).first()
        if user and check_password_hash(user.password, args['password']):
            return jsonify({'message': 'User  logged in successfully'})
        return jsonify({'error': 'Invalid username or password'}), 401

class UserSignupAPI(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str)
        parser.add_argument('email', type=str)
        parser.add_argument('password', type=str)
        args = parser.parse_args()
        user = User.query.filter_by(username=args['username']).first()
        if user:
            return jsonify({'error': 'Username already exists'}), 400
        user = User(username=args['username'], email=args['email'], password=generate_password_hash(args['password']))
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User  created successfully'})

class ProductAPI(Resource):
    def get(self, category_id=None):
        if category_id is None:
            # Retrieve all products
            products = Product.query.all()
            output = []
            for product in products:
                output.append({
                    'id': product.id,
                    'name': product.name,
                    'description': product.description,
                    'price': product.price,
                    'stock': product.stock,
                    'image_url': product.image_url
                })
            return jsonify({'products': output})

        # Retrieve products by category
        category = Category.query.get(category_id)
        if category is None:
            return jsonify({'error': 'Category not found'}), 404

        products = category.products
        if not products:
            return jsonify({'message': 'No products found in this category'}), 404

        output = []
        for product in products:
            output.append({
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': product.price,
                'stock': product.stock,
                'image_url': product.image_url
            })
        return jsonify({'products': output})

# class CartAPI(Resource):
#     def get(self, user_id):
#         cart = Cart.query.filter_by(user_id=user_id).first()
#         if cart:
#             items = []
#             for item in cart.items:
#                 items.append({'product_id': item.product_id, 'quantity': item.quantity})
#             return jsonify({'items': items})
#         return jsonify({'error': 'Cart not found'}), 404

#     def post(self, user_id):
#         parser = reqparse.RequestParser()
#         parser.add_argument('product_id', type=int)
#         parser.add_argument('quantity', type=int)
#         args = parser.parse_args()
#         cart = Cart.query.filter_by(user_id=user_id).first()
#         if cart:
#             item = CartItem(cart_id=cart.id, product_id=args['product_id'], quantity=args['quantity'])
#             db.session.add(item)
#             db.session.commit()
#             return jsonify({'message': 'Item added to cart successfully'})
#         return jsonify({'error': 'Cart not found'}), 404
class CartAPI(Resource):
    def get(self, user_id):
        cart = Cart.query.filter_by(user_id=user_id).first()
        if cart:
            items = []
            for item in cart.items:
                items.append({'product_id': item.product_id, 'quantity': item.quantity})
            return jsonify({'items': items})
        return jsonify({'error': 'Cart not found'}), 404

    def post(self, user_id):
        parser = reqparse.RequestParser()
        parser.add_argument('product_id', type=int, required=True)
        parser.add_argument('quantity', type=int, required=True)
        args = parser.parse_args()
        cart = Cart.query.filter_by(user_id=user_id).first()
        if cart:
            item = CartItem(cart_id=cart.id, product_id=args['product_id'], quantity=args['quantity'])
            db.session.add(item)
            db.session.commit()
            return jsonify({'message': 'Item added to cart successfully'})
        return jsonify({'error': 'Cart not found'}), 404

    def put(self, user_id):
        parser = reqparse.RequestParser()
        parser.add_argument('product_id', type=int, required=True)
        parser.add_argument('quantity', type=int, required=True)
        args = parser.parse_args()
        cart = Cart.query.filter_by(user_id=user_id).first()
        if cart:
            item = CartItem.query.filter_by(cart_id=cart.id, product_id=args['product_id']).first()
            if item:
                item.quantity = args['quantity']
                db.session.commit()
                return jsonify({'message': 'Item quantity updated successfully'})
            return jsonify({'error': 'Item not found in cart'}), 404
        return jsonify({'error': 'Cart not found'}), 404

    def delete(self, user_id):
        parser = reqparse.RequestParser()
        parser.add_argument('product_id', type=int, required=True)
        args = parser.parse_args()
        cart = Cart.query.filter_by(user_id=user_id).first()
        if cart:
            item = CartItem.query.filter_by(cart_id=cart.id, product_id=args['product_id']).first()
            if item:
                db.session.delete(item)
                db.session.commit()
                return jsonify({'message': 'Item removed from cart successfully'})
            return jsonify({'error': 'Item not found in cart'}), 404
        return jsonify({'error': 'Cart not found'}), 404
# Route registration
api.add_resource(UserLoginAPI, '/login')
api.add_resource(UserSignupAPI, '/signup')
api.add_resource(ProductAPI, '/products', '/products/<int:category_id>')
api.add_resource(CartAPI, '/carts/<int:user_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)