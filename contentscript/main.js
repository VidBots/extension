// 获取思维导图的元素
var mindmap_jsonData;
var graphnodes_jsonData;
var graphedges_jsonData;

var iframe_chat = 0;
var iframe_markdown = 0;
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "data_request"});
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.action === "data_send") {
        // 执行后台任务
        mindmap_jsonData = request.mindmap_jsonData;
        graphnodes_jsonData = request.graphnodes_jsonData;
        graphedges_jsonData = request.graphedges_jsonData;
    }
    
});


document.addEventListener('DOMContentLoaded', function () {
    // 获取按钮和内容容器的引用

    const graphButton = document.getElementById("graph_button");
    const mindmapButton = document.getElementById("mindmap_button");
    const assistant_button = document.getElementById("assistant_button");
    const blackboard_button = document.getElementById("blackboard_button");
    const contentContainer = document.getElementById("contentContainer");
    const closeButton = document.getElementById("close_button");


    // 添加点击事件处理程序，渲染思维导图
    mindmapButton.addEventListener("click", function () {
        //变换按钮颜色
        mindmapButton.className = 'temp_button_style'
       
        graphButton.className = 'graph_button'
        
        assistant_button.className = 'chat_button'

        blackboard_button.className = 'markdown_button'

        var childToRemove1 = document.getElementById("subContainer1");
        var childToRemove2 = document.getElementById("subContainer2");
        // 移除特定的子元素
        if (childToRemove1) {
            contentContainer.removeChild(childToRemove1);
        }
        if (childToRemove2) {
            contentContainer.removeChild(childToRemove2);
        }
        
        if (iframe_markdown != 0){
            iframe_markdown.style.display = "none";
        }
        if (iframe_chat != 0){
            iframe_chat.style.display = "none";
        }

        //定义边框颜色
        contentContainer.style.borderColor = '#a9bdbc'
        contentContainer.style.borderStyle = "groove"
        contentContainer.style.borderWidth = "4px"
        contentContainer.style.width = "92%"
        contentContainer.style.left = "4%"
        contentContainer.style.borderRadius = "10px"
        
        // alert("运行成功1 测试用的");
        renderMindMap(mindmap_jsonData);

    });


    // 添加点击事件处理程序，渲染graph
    graphButton.addEventListener("click", function () {

        //变换按钮颜色

        graphButton.className = 'temp_button_style'
       
        mindmapButton.className = 'mindmap_button'
        
        assistant_button.className = 'chat_button'

        blackboard_button.className = 'markdown_button'

        var childToRemove1 = document.getElementById("subContainer1");
        var childToRemove2 = document.getElementById("subContainer2");
        // 移除特定的子元素
        if (childToRemove1) {
            contentContainer.removeChild(childToRemove1);
        }
        if (childToRemove2) {
            contentContainer.removeChild(childToRemove2);
        }
   
        if (iframe_markdown != 0){
            iframe_markdown.style.display = "none";
        }
        if (iframe_chat != 0){
            iframe_chat.style.display = "none";
        }
        contentContainer.style.borderColor = '#a9bdbc'
        contentContainer.style.borderStyle = "groove"
        contentContainer.style.borderWidth = "4px"
        contentContainer.style.width = "92%"
        contentContainer.style.left = "4%"
        contentContainer.style.borderRadius = "10px"
        renderGraph(graphnodes_jsonData,graphedges_jsonData);

    });

    assistant_button.addEventListener("click",function(){
        let container = document.getElementById("contentContainer");
        
        assistant_button.className = 'temp_button_style'
       
        mindmapButton.className = 'mindmap_button'
        
        graphButton.className = 'graph_button'

        blackboard_button.className = 'markdown_button'

        // container.innerHTML = "";
        container.style.borderWidth = "0px"
        var childToRemove1 = document.getElementById("subContainer1");
        var childToRemove2 = document.getElementById("subContainer2");
        // 移除特定的子元素
        if (childToRemove1) {
            container.removeChild(childToRemove1);
        }
        if (childToRemove2) {
            container.removeChild(childToRemove2);
        }

        if (iframe_markdown != 0){
            iframe_markdown.style.display = "none";
        }
        

        if(iframe_chat == 0){
            iframe_chat = document.createElement('iframe');
            container.style.border = "none"
            container.style.width = "92%"
            container.style.left = "4%"
            iframe_chat.src = './html/chatwindow.html';
            iframe_chat.style.position = "absolute"
            iframe_chat.style.height = "100%"
            iframe_chat.style.width = "100%"
            iframe_chat.style.border = "none"
            iframe_chat.id = "iframe_chat"
            container.appendChild(iframe_chat);
        }
        else{
            // container.appendChild(iframe_chat); 
            console.log(iframe_chat)
            iframe_chat.style.display = "block";
        }

    });

    blackboard_button.addEventListener("click",function(){
        let container = document.getElementById("contentContainer");
        
        blackboard_button.className = 'temp_button_style'
       
        mindmapButton.className = 'mindmap_button'
        
        graphButton.className = 'graph_button'

        assistant_button.className = 'chat_button'

        // container.innerHTML = "";
        container.style.borderWidth = "0px"
        var childToRemove1 = document.getElementById("subContainer1");
        var childToRemove2 = document.getElementById("subContainer2");
        // 移除特定的子元素
        if (childToRemove1) {
            container.removeChild(childToRemove1);
        }
        if (childToRemove2) {
            container.removeChild(childToRemove2);
        }

        // if(window.network){
        //     window.network.destroy()
        // }
      
        if (iframe_chat != 0){
            iframe_chat.style.display = "none";
        }

        if(iframe_markdown == 0){
            iframe_markdown = document.createElement('iframe');
            container.style.border = "none"
            container.style.width = "98%"
            container.style.left = "1%"
            iframe_markdown.style.border = "none";

            iframe_markdown.id = "iframe_markdown"
            iframe_markdown.src = './html/sharenotes.html';
            iframe_markdown.style.position = "absolute"
            iframe_markdown.style.height = "100%"
            iframe_markdown.style.width = "100%"
            iframe_markdown.style.border = "none"
            container.appendChild(iframe_markdown);
        }
        else{
            console.log(iframe_markdown)
            iframe_markdown.style.border = "none";
            container.style.border = "none"

            iframe_markdown.style.display = "block";
        }
        

    });

    closeButton.addEventListener("click",function(){
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "close_iframe"});
          });
    });

    // 在这里添加其他按钮的事件处理程序
    // ...
});



