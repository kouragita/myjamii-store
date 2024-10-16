from sqlalchemy import Column, Integer, String, ForeignKey
from . import db, ma

class ShoppingCart(db.Model):
    __tablename__ = 'shopping_cart'

    product_id = Column(Integer, ForeignKey('product.id'), primary_key=True)
    product_name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    total = Column(Integer)

# Schema for ShoppingCart
class ShoppingCartSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ShoppingCart
        load_instance = True
