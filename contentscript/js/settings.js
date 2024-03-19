
document.addEventListener("DOMContentLoaded",function(){

    var button = document.getElementById("saveSettings");
    button.addEventListener("click", function saveSettings() {
        // 在这里添加保存设置的逻辑
        window.alert('设置已保存！');
        setTimeout(function() {
        window.close();
        }, 3000); // 5000 毫秒即 5 秒
    })

})