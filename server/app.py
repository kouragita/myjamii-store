from flask import Flask
from flask_restful import Api, Resource
from models import init_app, db
from models.user import User, UserSchema
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database and migration services
init_app(app)
migrate = Migrate(app, db)

api = Api(app)

# Sample Resource for User using Marshmallow for serialization
class UserResource(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if user:
            user_schema = UserSchema()
            return user_schema.dump(user)
        return {"message": "User not found"}, 404

    def post(self):
        # Logic to create a new user will go here
        pass

# Registering the resource with the API
api.add_resource(UserResource, '/user/<int:user_id>')

if __name__ == '__main__':
    app.run(debug=True)
