FROM docker.1ms.run/python:3.9

WORKDIR /app

COPY requirements.txt ./

RUN pip install opencv-python-headless

RUN pip install --no-cache-dir -r requirements.txt -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple

RUN apt-get update && apt-get install -y libgl1

COPY . .

EXPOSE 10001

CMD ["python","run.py"]