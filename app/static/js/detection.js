const map = new Map();
// 用来存储需要处理的初始图像
let ImageData = '';

const Irange = document.querySelector('#Irange');
Irange.addEventListener('input', () => {
    const conf = document.querySelector('#conf');
    conf.textContent = Irange.value;
});

const file_input = document.querySelector('#file-input');
file_input.addEventListener('change', () => {
    const file = file_input.files[0];
    ImageData = file;
    const filetype = /\.(.*)$/.exec(file.name)[1];
    if (file) {
        const form = new FormData();
        form.append('file', file);
        form.append('data', JSON.stringify({ "conf": Irange.value / 100 }));

        fetch('/api/yolo', {
            method: 'POST',
            body: form,
        }).then((response) => {
            return response.json();
        }).then(data => {
            const infoList = document.querySelector('#infoList');
            infoList.innerHTML = '';
            showConvas(ImageData, { 'old': true, 'oldInfo': data })
        });
        showConvas(file);
    }
    file_input.value = '';
});

// 绘制图像函数
function showConvas(fileOrUrl, cli = { 'ii': false, 'info': '', 'old': false, 'oldInfo': '' }) {
    // 基础配置
    const img = new Image();
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    // 调整 Canvas 大小的函数
    function reCanvaseSize(imgHeight, imgWidth) {
        const imglv = imgHeight / imgWidth;
        const client = canvas.getBoundingClientRect();
        const lv = client.height / client.width;
        if (imglv <= 1) {
            canvas.width = imgWidth;
            canvas.height = imgWidth * lv;
        } else {
            canvas.height = imgHeight;
            canvas.width = imgHeight * imglv;
        }
    }

    // 图片加载完成后的处理函数
    img.onload = function () {

        // 根据图片大小调整 Canvas 大小
        reCanvaseSize(img.height, img.width);
        // 显示图片
        ctx.drawImage(img, 0, 0, img.width, img.height);

        if (cli['ii']) {

            // 如果 `cli['ii']` 为 true，则绘制额外的部分
            reCanvaseSize(cli['info'][2] - cli['info'][0], cli['info'][3] - cli['info'][1]);
            ctx.drawImage(img, cli['info'][0], cli['info'][1], cli['info'][2] - cli['info'][0], cli['info'][3] - cli['info'][1], 0, 0, cli['info'][2] - cli['info'][0], cli['info'][3] - cli['info'][1]);
            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = 'red';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(cli['cls'], 0, 0);
        } else if (cli['old']) {
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 5;
            console.log(cli['oldInfo'])
            // 添加到列表之前要初始化
            const infoList = document.querySelector('#infoList');
            infoList.innerHTML = '';
            map.clear()
            cli['oldInfo'].xyxy.forEach((element, index) => {
                ctx.strokeRect(element[0], element[1], element[2] - element[0], element[3] - element[1]);
                ctx.font = 'bold 40px Arial';
                ctx.fillStyle = 'red';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText(cli['oldInfo'].cls[index], element[0], element[1]);

                // 添加到列表
                const ILelement = document.createElement('button');
                ILelement.classList.add('element');
                ILelement.innerText = `${(cli['oldInfo'].conf[index] * 100).toFixed(0)}%    ${cli['oldInfo'].cls[index]}`;
                infoList.appendChild(ILelement);
                map.set(ILelement, element);
            });
            // 再监听一次
            EventListenerList()
        }
    };

    // 判断传入的是 URL 还是 File 对象
    if (fileOrUrl instanceof File) {
        // 如果是 File 对象，读取为 Data URL
        const FileRead = new FileReader();
        FileRead.onload = function (e) {
            img.src = e.target.result;  // 设置 img 的 src 为 Data URL
        };
        FileRead.readAsDataURL(fileOrUrl);
    } else {
        // 如果是 URL，直接设置 img 的 src
        img.src = fileOrUrl;
    }
}

function EventListenerList() {
    const infoList = document.querySelector('#infoList');
    infoList.addEventListener('click', (event) => {
        const element = event.target;
        if (element.className == 'element') {
            showConvas(ImageData, { 'ii': true, 'info': map.get(element), 'cls': element.innerText });
        }
    });
}


// 数据库列表函数
function showOlList(i) {
    console.log(OlData[i])
    // 这里面有异步操作，使用回调函数，确保执行完成
    ImageData = `/static/user_img/${OlData[i]['file_name']}`;
    showConvas(ImageData, { 'old': true, 'oldInfo': OlData[i] })
}