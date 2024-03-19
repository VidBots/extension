
function settingsClose(){

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "settingsClose"});
      });
};


function logOut(){

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "logOut"});
      });

};

function changeMessage(){

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "changeMessage"});
      });

};



document.addEventListener("DOMContentLoaded", function () {



    var settingsCloseButton = document.getElementById("SettingsClose");

    /* 用户实际登录与注册按钮 */
    var logoutButton = document.getElementById("logout");
    var changeButton = document.getElementById("change");

    settingsCloseButton.addEventListener("click",function(){
        settingsClose();
    })

    logoutButton.addEventListener("click",function(){
        logOut();
    })

    changeButton.addEventListener("click",function(){
        changeMessage();
    })



});
