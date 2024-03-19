var editor; // 将编辑器对象声明在全局作用域


function exportMarkdown() {
    // 获取Markdown内容
    var markdown = editor.getMarkdown();

    // 创建Blob对象
    var blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });

    var mdlink = URL.createObjectURL(blob);
    // 调用chrome下载API
    chrome.downloads.download({
        url: mdlink, // blob的URL
        filename: "exported.md", // 文件名，可以自定义
        saveAs: true // 是否弹出保存对话框，可以自定义
    });

}

function push_shuishan() {

    // 在 input-container 中创建输入框和按钮
    const inputContainer = document.createElement("div");
    inputContainer.style.position = "absolute";
    inputContainer.className = "input-container"
    inputContainer.style.width = "50%"
    inputContainer.style.left = "25%"
    inputContainer.style.height = "40%";
    inputContainer.style.top = "30%";
    inputContainer.id = "shuiShanPushCommit";
    inputContainer.style.zIndex = "9999";


    inputContainer.appendChild(createInput("text", "mdFileName", "File Name"));
    inputContainer.appendChild(document.createElement("br"));
    inputContainer.appendChild(createInput("text", "commitMessage", "Commit Message"));
    inputContainer.appendChild(document.createElement("br"));
    inputContainer.appendChild(createButton("Push ShuiShan", getData));

    var container = document.getElementById("editor");
    container.appendChild(inputContainer);

}

function backText() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "backText"});
    });
    
}

// 创建输入框
function createInput(type, id, placeholder) {
    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.placeholder = placeholder;
    return input;
}

// 创建按钮
function createButton(text, onclick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.onclick = onclick;
    return button;
}

// 获取输入框内容
function getData() {
  
    const md_file_name = document.getElementById("mdFileName").value;
    const commit_message = document.getElementById("commitMessage").value;
    var md_file_content = editor.getMarkdown();
    if((md_file_name!="")&&(commit_message!="")){
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "push_shuishan", md_file_name: md_file_name, md_file_content: md_file_content, commit_message: commit_message});
        });

        var container = document.getElementById("editor");
        var inputContainer = document.getElementById("shuiShanPushCommit");
        container.removeChild(inputContainer);

    }
    else{
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "push_shuishan_error", md_file_name: md_file_name, md_file_content: md_file_content, commit_message: commit_message});
          });

        var container = document.getElementById("editor");
        var inputContainer = document.getElementById("shuiShanPushCommit");
        container.removeChild(inputContainer);
    }

}



document.addEventListener("DOMContentLoaded", function () {
    // 初始化编辑器
    editor = editormd("editor", {
    height: "95%",
    width: "95%",
    emoji: true,
    taskList: true,
    tocm: true,
    tex: true,
    watch : false,     
    flowChart: true,
    sequenceDiagram: true,
    path: "../editor/lib/",
    toolbarIconsClass : {
        export : "fa fa-download",  // export图标
        push : "fa fa-cloud-upload",// push图标
        back : "fa fa-book"
    },

 
    toolbarIcons: ["undo", "redo", "|", "bold", "italic", "quote", "|", "h1", "h2", "h3", "|", "list-ul", "list-ol", "|", "link", "image", "code", "|", "preview", "watch", "|", "export", "push" ,"back"],
    
    lang : {
        toolbar : {
            export: "导出为Markdown文件",  // export提示文本
            push: "推送至水杉码园", // 收藏提示文本
            back: "返回课程讲义"
        }
    },

    toolbarHandlers: {
        export: function () {
            exportMarkdown();
        }, 
        push: function(){
            push_shuishan();
        },
        back: function(){
            backText()
        }
    },
    
    });
    // editor.unwatch();
 
    // 在这里可以通过 editor 对象来访问编辑器的方法和属性
    // console.log(editor.getValue()); // 获取编辑器中的内容
});
