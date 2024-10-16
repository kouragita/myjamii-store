from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from . import db, ma

class Payment(db.Model):
    __tablename__ = 'payment'

    id = Column(Integer, primary_key=True)
    amount = Column(Integer, nullable=False)
    method = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'))

    user = relationship('User', back_populates='payments')

# Schema for Payment
class PaymentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Payment
        load_instance = True
