
var userIcon = document.getElementById("userlogin");

document.addEventListener("DOMContentLoaded", function () {


    resetLog();


});

function resetLog(){

    chrome.storage.local.get(['loginFlag'], function(result) {

        if(result.loginFlag === true){

            summarize();
            
            loggedIn();
          
        }
        else if(result.loginFlag === false){

            summarize_unauthorized();

            userHtml();
      
        }

      });

}



function summarize(){

    let summarizeButton = document.getElementById("summarizeButton");
    summarizeButton.addEventListener("click", function () {

    // 向 content.js 发送消息来触发渲染操作
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "summarize" }, function (response) {
            // 在这里处理来自后台脚本的响应
        });

        window.close();

    });

 
    });
 
}

function summarize_unauthorized(){

    let summarizeButton = document.getElementById("summarizeButton");
    summarizeButton.addEventListener("click", function () {

    // 向 content.js 发送消息来触发渲染操作
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "summarize_unauthorized" }, function (response) {
            // 在这里处理来自后台脚本的响应
        });

    });

    });
 
}

function userHtml(){

    userIcon.addEventListener("click",function (){
        
        // 向 content.js 发送消息来触发渲染操作
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "userHtml" }, function (response) {
                // 在这里处理来自后台脚本的响应
            });

        });
 
     });

}

function loggedIn() {
    userIcon.addEventListener("click", function () {
        // 向 content.js 发送消息来触发渲染操作
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "userLoggedIn" }, function (response) {
                if (response && response.success) {
                    console.log("User logged in successfully");
                } else {
                    console.error("User login failed");
                }
            });
        });
    });
}





