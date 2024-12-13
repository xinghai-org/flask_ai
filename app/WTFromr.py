from flask_wtf import FlaskForm
from wtforms import StringField,PasswordField,SubmitField
from wtforms.validators import DataRequired,Length,EqualTo

class SignUpForm(FlaskForm):
    username = StringField(label='用户名',render_kw={'placeholder': '用户名'},validators=[DataRequired(message='用户名不能为空'),Length(2,15,message='长度应该在2，15个字符')])
    password = PasswordField(label='密码',render_kw={'placeholder': '密码'},validators=[DataRequired(message='密码不能为空'),Length(2,15,message='长度应该在2，15位')])
    password2 = PasswordField(label='确认密码',render_kw={'placeholder': '确认密码'},validators=[DataRequired(message='密码不能为空'),EqualTo('password',message='两次密码不一致')])
    submit = SubmitField(label='注册',render_kw={'class':'submit'})

class LoginForm(FlaskForm):
    lusername = StringField(label='用户名',render_kw={'placeholder': '用户名'},validators=[DataRequired(message='用户名不能为空'),Length(2,15,message='长度应该在3，15个字符')])
    lpassword = PasswordField(label='密码',render_kw={'placeholder': '密码'},validators=[DataRequired(message='密码不能为空'),Length(2,15,message='长度应该在2，15位')])
    lsubmit = SubmitField(label='登入',render_kw={'class':'submit'})