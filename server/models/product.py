from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from . import db, ma

class Product(db.Model):
    __tablename__ = 'product'

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('order.id'))
    total = Column(Integer)

    orders = relationship('Order', back_populates='product')
    product_category = relationship('ProductCategory', back_populates='product')

# Schema for Product
class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        load_instance = True
