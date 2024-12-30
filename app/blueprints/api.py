import requests
from .. import Blueprint,request,Response,Cinfo,User,current_user,db
from .. import YoloModel,jsonify
from .. import login_required
from .. import flask_config
import json
import io
from PIL import Image
import re
api = Blueprint('api',__name__)

@api.route('/xunfei',methods=['POST'])
def proxy():
    # 目标大模型的 API 地址
    url = "https://spark-api-open.xf-yun.com/v1/chat/completions"
    
    # 请求头
    headers = {
        "Authorization": flask_config['xf'],  # 请替换为有效的 token
        "Content-Type": "application/json"
    }
    
    # 从前端获取请求的 JSON 数据
    data = request.get_json()

    response = requests.post(url, json=data, headers=headers, stream=True)
    response.encoding = "utf-8"
    def proxy():
        for line in response.iter_lines(decode_unicode="utf-8"):
            e = re.findall('\{.*\}',line)
            if e:
                if eval(e[0])['message'] != 'Success':
                    yield eval(e[0])['message']
                else:
                    yield str(eval(e[0])['choices'][0]['delta']['content'])
    return Response(proxy())

@api.route('/yolo',methods=['POST'])
def yolo():
    data = request
    conf = json.loads(data.form['data'])
    img = Image.open(io.BytesIO(data.files['file'].stream.read()))
    print('你现在的置信度是',conf['conf'])
    result = YoloModel(img,conf=conf['conf'],stream=True)
    for e in result:
        boxes = e.boxes
        conf = [float(i) for i in boxes.conf]
        cls = [e.names[int(i)] for i in boxes.cls]
    js = {
        'cls':cls,
        'xyxy':[[float(e) for e in i] for i in boxes.xyxy],
        'conf':conf
    }

    # 存入数据库
    cinfo = Cinfo(data=js,uid=current_user.id)
    db.session.add(cinfo)
    db.session.commit()
    img.save(f"./app/static/user_img/{current_user.id}_{cinfo.id}.jpg")
    
    return jsonify(js)
