from .. import Blueprint,app,render_template,request,current_user,User,db,flash,session
from .. import login_required
from datetime import datetime
page = Blueprint('page',__name__)

@app.route('/')
@page.route('/index')
def index():
    return  render_template('/index.html')

@page.route('/detection')
@login_required
def detection():
    cinfoList = User.query.get(current_user.id).cinfo
    data = []
    for i in cinfoList:
        di = i.data.copy()
        di['date'] = i.create_date.strftime(r'%Y-%m-%d %H:%M:%S')
        di['id'] = i.id
        di['file_name'] = f'{i.uid}_{i.id}.jpg'
        data.append(di)
    return render_template('detection.html',data=data)

@page.route('/my',methods=['POST','GET'])
@login_required
def my():
    user = User.query.get(current_user.id)

    if request.method == 'POST':
        data = request.get_json()
        user.email = data['email']
        user.name = data['name']
        if len(data['password']) >= 6:
            user.password = data['password']
        elif data['cpd']:
            session['message'] = '密码格式错误'
        db.session.commit()
        return 'ok'
    
    message = session.get('message')
    session['message'] = None
    return render_template('my.html',username=user.username,email=user.email,name=user.name,message=message,date=user.create_date)