from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from . import db, ma

class ProductCategory(db.Model):
    __tablename__ = 'productcategory'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)

    product_id = Column(Integer, ForeignKey('product.id'))
    product = relationship('Product', back_populates='product_category')

# Schema for ProductCategory
class ProductCategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ProductCategory
        load_instance = True
