const icon = document.querySelector(".icon").querySelector("svg");
const conv = document.querySelector(".conv");
icon.addEventListener("click", (event) => {
  const content = document.querySelector(".content");
  const Text = content.innerText;

  const message = [];
  if ((Text.length >= 1) & (Text != "\n") & (Text != " ")) {
    content.innerText = "";

    // 添加元素
    const Conversation = document.querySelectorAll(".Conversation");
    const newUserConv = document.createElement("div");
    newUserConv.innerHTML = `<span>${Text}</span>`;
    newUserConv.className = "user  Conversation";
    conv.appendChild(newUserConv);
    const newAssistantConv = document.createElement("div");
    newAssistantConv.innerHTML = `<span>. . .</span>`;
    newAssistantConv.className = "assistant  Conversation";
    conv.appendChild(newAssistantConv);
    newAssistantConv.scrollIntoView({ behavior: "smooth" });
    const assistantSpan = newAssistantConv.querySelector("span");
    // 创建内容
    Array.from(Conversation)
      .slice(-30)
      .forEach((event) => {
        const ConvText = event.querySelector("span").innerText;
        if (event.classList.contains("assistant")) {
          message.push({ role: "assistant", content: ConvText });
        } else {
          message.push({ role: "user", content: ConvText });
        }
      });
    message.push({ role: "user", content: Text });
    console.log(message);
    fetch("/api/xunfei", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        max_tokens: 4096,
        messages: message,
        model: "4.0Ultra",
        Stream: true,
      }),
    }).then((response) => {
      if (!response.ok) {
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const readStream = async () => {
        let done = false;
        let rr = "";
        const md = window.markdownit();
        assistantSpan.innerText = "";
        while (!done) {
          const { value, done: doneIng } = await reader.read();
          done = doneIng;
          if (value) {
            const result = decoder.decode(value, { stream: true });
            rr += result;
            assistantSpan.innerHTML = md.render(rr);
            conv.scrollTop = conv.scrollHeight;
          }
        }
      };
      readStream();
    });
  }
});