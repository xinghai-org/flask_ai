from flask import Flask,render_template,Blueprint,session,request,Response,jsonify,flash,redirect,url_for,session
from flask_login import LoginManager,UserMixin,login_required,logout_user,login_user,current_user
from flask_sqlalchemy import SQLAlchemy
import json
from ultralytics import YOLO

# 加载配置文件
with open('./config.json','r') as f:
    flask_config = json.load(f)

print('数据',flask_config)

# 创建app
app = Flask(__name__)

# 初始化配置
app.secret_key = 'abcdefg'
YoloModel = YOLO('./app/yolo11s.pt')
print("模型信息：",YoloModel.info())
# 配置数据库
# 正确：使用临时变量来存储字典值，然后在 f-string 中使用变量
username = flask_config['mysql']['username']
password = flask_config['mysql']['password']
host = flask_config['mysql']['host']
database = flask_config['mysql']['database']
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{username}:{password}@{host}/{database}"
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
