from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from models import db, User, Product, Cart, CartItem, Category
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_migrate import Migrate
import os

app = Flask(__name__)
api = Api(app)
CORS(app)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myjamiistoredb_user:SiyUEiuKRYm76JSa8rTDgOh9mzQZkla6@dpg-csahb2l6l47c73f0j8j0-a.oregon-postgres.render.com/myjamiistoredb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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

        new_product = Product(
            name=args['name'],
            description =args.get('description'),
            price=args['price'],
            stock=args['stock'],
            image_url=args.get('image_url'),
            category_id=args['category_id']
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify({
            'message': 'Product created successfully',
            'product': {'id': new_product.id, 'name': new_product.name}
        })

    def put(self, product_id):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('description', type=str)
        parser.add_argument('price ', type=float)
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


api.add_resource(UserLoginAPI, '/login')
api.add_resource(UserSignupAPI, '/signup')
api.add_resource(ProductAPI, '/products', '/products/category/<int:category_id>', '/products/<int:product_id>')
api.add_resource(StockReductionAPI, '/products/<int:product_id>/reduce_stock')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5555))
    app.run(host="0.0.0.0", port=port, debug=True)