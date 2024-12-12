
fetch("https://spark-api-open.xf-yun.com/v1/chat/completions", {
    method: "POST",
    headers: {
        Authorization: "Bearer xDdDaewkCTFwlvrttZWk:wkWVzekWLCGnLBSnQOBh", // 请替换为有效的 token
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        messages: [
            { role: "assistant", content: "你好呀" },
            { role: "user", content: "介绍一下广东" },
        ],
        model: "lite",
        Stream: true,
    }), // 将数据转换为 JSON 字符串
})
    .then((response) => {
        if (!response.ok) {
            console.error("请求失败:", response.status);
            return;
        }

        // 获取响应体的 ReadableStream
        const reader = response.body.getReader();
        const decoder = new TextDecoder()
        let done = false;
        let result = "";

        // 逐步读取流数据
        const readStream = async () => {
            while (!done) {
                const {value,done:doneIng} = await reader.read() // 使用 await 等待流数据
                done = doneIng
                if (value) {
                    result = decoder.decode(value,{stream:true})
                    result = /\{.*\}/.exec(result)
                    if (result){
                        console.log(JSON.parse(result[0]).choices[0].delta.content)
                    }
                }
            }
        };
        readStream()
    })
    .catch((error) => {
        console.error("请求失败:", error);
    });
