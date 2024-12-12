from flask import Flask,render_template,Blueprint,session,request,Response,jsonify,flash,redirect,url_for,session
from flask_login import LoginManager,UserMixin,login_required,logout_user,login_user,current_user
from flask_sqlalchemy import SQLAlchemy

from ultralytics import YOLO

# 创建app
app = Flask(__name__)

# 初始化配置
app.secret_key = 'abcdefg'
YoloModel = YOLO('./app/yolo11s.pt')
print("模型信息：",YoloModel.info())
# 配置数据库
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@host/yousql'
db = SQLAlchemy()
db.init_app(app)
from .model import *
# 登入配置
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
# # 登入钩子函数
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

# 导入路由
from .roust import *
