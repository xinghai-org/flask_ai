function show_hide() {
    var login = document.getElementById("container1");
    var signup = document.getElementById("container2");

    if (login.style.display === "none") {
        login.style.display = "block";  //lonin出現
        signup.style.display = "none";  //signup消失

    } else {
        login.style.display = "none";   //login消失
        signup.style.display = "block"; //signup出現
        signup.style.visibility = "visible";
    }
}