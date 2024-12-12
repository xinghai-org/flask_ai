from app import app,render_template,request,logout_user,User,flash,db,login_user,redirect,url_for,current_user
# 导入表单
from .WTFromr import LoginForm,SignUpForm


# 导入蓝图
from .blueprints.page import page
from .blueprints.api import api
# 注册蓝图
app.register_blueprint(page,url_prefix='/page')
app.register_blueprint(api,url_prefix='/api')

# 登入
@app.route('/login',methods=['POST','GET'])
def login():
    if request.method == 'POST':
        # 信息
        username = request.form.get('lusername')
        password = request.form.get('lpassword')
        # 退出登入
        logout_user()
        # 登入
        user = User.query.filter_by(username=username,password=password).first()
        if user:
            login_user(user)
            return redirect(url_for('index'))
        else:
            flash("账号密码错误")

    loginForm = LoginForm()
    signUpFrom = SignUpForm()
    return render_template('login.html',loginForm=loginForm,signUpFrom=signUpFrom)

# 注册
@app.route('/register',methods=['POST','GET'])
def register():
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')
        password2 = request.form.get('password2')
        if not (username and password and password == password2):
            flash('请正确设置账号和密码')
            return redirect(url_for('login'))
        # 判断用户是否存在
        if User.query.filter_by(username=username).first():
            flash('用户已存在')
        else:
            db.session.add(User(username=username,password=password))
            db.session.commit()
            flash('注册成功')
    return redirect(url_for('login'))

# 登出
@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))