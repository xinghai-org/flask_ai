const edit_profile = document.querySelector('#edit_profile')
const submit_profile = document.querySelector('#submit_profile')
const email = document.querySelector('#profile-email')
const username = document.querySelector('#profile-username')
const edit_password = document.querySelector('#edit_password')
const new_password = document.querySelector('#new_password')
let cpd = false

// 修改信息
edit_profile.addEventListener('click', () => {
    submit_profile.style.display = 'block'
    edit_profile.style.display = 'none'
    username.setAttribute("contenteditable", "true")
    username.style.border = 'solid'
    email.setAttribute("contenteditable", "true")
    email.style.border = 'solid'

})
// 提交信息
submit_profile.addEventListener('click', () => {
    fetch('/page/my', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: username.innerText,
            email: email.innerText,
            password: new_password.innerText,
            cpd: cpd
        })
    }).then(() => {
        window.location.href = '/page/my'
    })
})

edit_password.addEventListener('click', () => {
    new_password.parentElement.style.display = 'block'
    edit_password.style.display = 'none'
    submit_profile.style.display = 'block'
    cpd = true
})