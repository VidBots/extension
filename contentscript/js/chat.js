document.addEventListener("DOMContentLoaded",function(){



    // 成功发送
   const chatBox=document.getElementById("chat-box");
   var input_button=document.getElementById("submit-btn");
   // 发送内容
   var userInput=document.getElementById("user-input");
   //定义消息类型
   var message_type1 = "user_message";
   var message_type2 = "system_message";
   //socket与后端通信
   const serverUrl = 'https://8.130.98.122:8765'; // WebSocket server URL
   const socket = io.connect(serverUrl);

   socket.on("connect", () => {
    addToChatBox("你好,我是VidBot智能助教!有问题尽管问我...", message_type2);
    });

    socket.on("message", (data) => {
        addToChatBox(data.data, message_type2);

    });

    socket.on("disconnect", () => {
        addToChatBox("你好,我是VidBot智能助教!有问题尽管问我...");
    });

       function addToChatBox(message,message_type) {

           const newMessage = document.createElement("div");
           var date=new Date();
           var hour=date.getHours();
           var mm=date.getMinutes();
           var time=hour+':'+mm;
           message = message.replace(/ /g, "\u00A0");
           if(message_type === "user_message"){
               newMessage.style.margin = "10px"
               newMessage.style.maxWidth = '80%';
           
               newMessage.style['justify-content'] = 'right'
               newMessage.style.float = 'right';
               newMessage.style.width = "100%"
               newMessage.style.display = "inline-block";
               newMessage.style.textAlign = 'left';
               newMessage.style.justifyContent = 'right'
               newMessage.style.float = 'right';
               newMessage.style.overflowWrap = 'break-word';
               var content_div = document.createElement('div');
               content_div.className = "chat_right_content clearfix"
               content_div.style.right= '7%'
               content_div.style.float = 'right'
               content_div.textContent = message;
               
               var ans='<div class="chat_right_item_2">'+
               '<div class="chat_right_time clearfix">'+time+'&nbsp'+'&nbsp'+'&nbsp'+'&nbsp'+'<i class = "fa fa-user-circle"\
               style="font-size:30px;color:black;text-shadow:1px 1px 1px #000000;">'
               +'</i>' +
               '</div>'
               
               ;
               // var oLi=document.createElement("div");
               // oLi.setAttribute("class","chat_right");
               newMessage.innerHTML=ans;
               newMessage.appendChild(content_div)
              
               chatBox.append(newMessage);
               userInput.value="";   
           }
           else{

               newMessage.style.margin = "10px"
               newMessage.style.maxWidth = '80%';  
               newMessage.style.float = 'left';
               newMessage.style.width = "100%"
               newMessage.style.display = "inline-block";
               newMessage.style.textAlign = 'left';
               newMessage.style.justifyContent = 'left'
               newMessage.style.float = 'left';
               newMessage.style.overflowWrap = 'break-word';
               var content_div = document.createElement('div');
               content_div.className = "chat_left_content clearfix"
               content_div.style.left= '7%'
               content_div.style.float = 'left'
               content_div.textContent = message;
               
               var reply='<div class="chat_left_item_2">'+
               '<div class="chat_left_time clearfix">'+ '<img src = "../png/assistant.png" style =width="40" height="30">' +
                '</img>'+'&nbsp'+'&nbsp'+'&nbsp'+'&nbsp'
                +'</div>'
               
               ;
               // var oLi=document.createElement("div");
               // oLi.setAttribute("class","chat_right");
               newMessage.innerHTML=reply;
               newMessage.appendChild(content_div)
              
               chatBox.append(newMessage);
               userInput.value="";
              
           }
           //清除格式防止影响后置布局
           newMessage.style.clear = 'both';
           chatBox.scrollTop = chatBox.scrollHeight;
           
              
       }



    // 监听文本框的键盘按下事件
    userInput.addEventListener("keydown", function(event) {

        // 检查按下的键是否为 Enter 键并且同时按下了 Shift 键 (key 为 "Enter" 并且 shiftKey 为 true)
        if (event.key === "Enter" && event.shiftKey) {
            // 允许默认的 Shift + Enter 换行行为
            return;
        }

        // 检查按下的键是否为 Enter 键 (key 为 "Enter")
        if (event.key === "Enter") {
            // 阻止默认的 Enter 换行行为
            event.preventDefault();
            // 触发按钮的点击事件
            input_button.click();
        }
        
    });

   input_button.addEventListener("click",function(){
       const message = userInput.value;
       if (message.trim() === "") return;
       addToChatBox(`${message}`,message_type1);
       socket.emit('message', {"message": message });
   });

});

