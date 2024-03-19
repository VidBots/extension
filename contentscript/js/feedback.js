
function updateFileName() {
    var fileName = document.getElementById('image').files[0].name;
    document.getElementById('file-label').textContent = fileName || '未选择文件';
  }

document.addEventListener("DOMContentLoaded",function(){

    var button = document.getElementById("feedbackButton");
    button.addEventListener("click", function submitFeedback() {
        // 在这里添加保存设置的逻辑
        var formData = new FormData(document.getElementById('feedbackForm'));
        // 这里可以添加 JavaScript 代码，用于处理提交反馈的逻辑
        window.alert('反馈已提交！');
    })

    var input = document.getElementById('image');

    // 添加 change 事件监听器
    input.addEventListener('change', function () {
        // 调用你想要执行的操作
        updateFileName();
    });

    

})