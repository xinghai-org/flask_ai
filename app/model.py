from app import db,UserMixin
from datetime import datetime
from sqlalchemy import func

class User(UserMixin,db.Model):
    id = db.Column(db.Integer,primary_key=True)
    username = db.Column(db.String(20),unique=True,nullable=False)
    password = db.Column(db.String(18),nullable=False)
    name = db.Column(db.String(30),default='吴彦祖')
    email = db.Column(db.String(30),default='hahaha@xinghai.xyz')
    create_date = db.Column(db.DateTime,default=func.now())

    cinfo = db.relationship('Cinfo',backref='user',lazy=True)

class Cinfo(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    data = db.Column(db.JSON)
    create_date = db.Column(db.DateTime,default=func.now())
    uid = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
