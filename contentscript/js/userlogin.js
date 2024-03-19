function loginCheck(){

    let account = document.getElementById("loginAccount").value;

    let password = document.getElementById("loginPassword").value;

 
    if(account == "" || password == ""){
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "loginError"});
        });
        return;
    }
    else{

        console.log("登录调试"+account+" "+password)
        let requestData1 = {
            student_id : account,
            student_pwd : password,
        };
    
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "first_login",data:requestData1});
        });
        
        

    }

}

function signCheck(){

    let student_id = document.getElementById("signupAccount").value;
    

    let email = document.getElementById("signupEmail").value;

    let Token = document.getElementById("Token").value;

    let password = document.getElementById("signupPassword").value;

    let confirmPassword = document.getElementById("signupConfirmedPassword").value;


    if((student_id != "") && (email != "") && (password == confirmPassword)){

        return new Promise((resolve, reject) => {
            // 构建要发送的数据对象
            const requestData2 = {
                student_id : student_id,
                access_key : Token,
                email: email,
                pwd : password
            };
            fetch("https://47.102.85.67:8080/regist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData2),
            })
            .then(response => {
                
                if (response.ok) {
                return response.json();
                } else {
                reject('请求失败');
                }
            })
            .then(data => {
            
                if(data.success_flag == "201"){
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "signUpError"});
                    });
                }else{     
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "signUp"});
                    });
                }
            
            })
            .catch(error => {
                
            });
        }); 

    }
    else{

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "signUpError"});
        });
    }


 

}

function loginClose(){

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "loginClose"});
    });
}

document.addEventListener("DOMContentLoaded", function () {

    // 获取具有ID为"signUp"的元素
    var signUpButton = document.getElementById("signUp");

    // 获取具有ID为"signIn"的元素
    var signInButton = document.getElementById("signIn");

    // 获取具有ID为"login-box"的元素
    var loginBox = document.getElementById("login-box");

    // 获取所有具有类名为"txtb"的元素
    var inputElements = document.querySelectorAll(".txtb input");

    // 添加点击事件处理程序，给具有ID为"login-box"的元素添加名为'right-panel-active'的CSS类
    signUpButton.addEventListener("click", function () {
        loginBox.classList.add("right-panel-active");
    });

    // 添加点击事件处理程序，从具有ID为"login-box"的元素中移除名为'right-panel-active'的CSS类
    signInButton.addEventListener("click", function () {
        loginBox.classList.remove("right-panel-active");
    });

    // 遍历所有具有类名为"txtb"的元素，添加焦点事件处理程序
    inputElements.forEach(function (inputElement) {
        inputElement.addEventListener("focus", function () {
            // 给当前输入元素添加名为'focus'的CSS类
            inputElement.classList.add("focus");
        });

        // 添加失焦事件处理程序
        inputElement.addEventListener("blur", function () {
            // 如果当前输入元素的值为空，移除名为'focus'的CSS类
            if (inputElement.value === '') {
                inputElement.classList.remove("focus");
            }
        });
    });


    /* 用户实际登录与注册按钮 */
    var login_Button = document.getElementById("loginButton");
    var signup_Button = document.getElementById("signup_Button");

    login_Button.addEventListener("click",function(){

        loginCheck();
    })

    signup_Button.addEventListener("click",function(){
        signCheck();
    })

    /* 给关闭按钮添加点击事件 */
    var closeButton = document.getElementById("loginClose")
    closeButton.addEventListener("click",function(){
        loginClose();
    })



});
