
//思维导图渲染函数
function renderMindMap(jsonData){

    var container_map = document.getElementById("contentContainer");
    var max_lines = 0;
    var nodes_convert = new vis.DataSet();
    var edges_convert = new vis.DataSet();

    // 模拟 JSON 数据
    function countDots(inputString) {
      // 使用正则表达式匹配字符串中的点号，并返回匹配的个数
      var matches = inputString.match(/\./g);
      if (matches) {
        return matches.length;
      } else {
        return 0;
      }
    }

    function convertJsonToVisData(jsonData, parentNodeId) {
        var nodes = [];
        var edges = [];

        for (var i = 0; i < jsonData.length; i++) {
            var node = jsonData[i];
            var nodeId = node.id;
            // var label = node.key_words;
            var href = node.href; // 添加链接属性
            var start_time = node.start_time;
            var class_num = 4-countDots(nodeId);
            var level = 4 - class_num;
            var keyWords= node.key_words;
            var colors = ["#d5ebe3","#fceaea","#c3ddf6","#87ab69","#75975e","#658354"]
            var label = ''; // 初始化 label

            for (var k = 0; k < keyWords.length; k++) {
                label += keyWords[k];
                var temp_max_lines = 0;
                if (((k + 1) % 8 === 0)&&k<keyWords.length-2) {
                    label += '\n'; // 在每6个字符后添加一个换行符
                    temp_max_lines += 1;
                    if(temp_max_lines > max_lines){
                        max_lines = temp_max_lines;
                    }
                }
            }
            if(max_lines < 1){
                max_lines = 1;
            }

            nodes.push({ level:level,id: nodeId, label: label, href: href ,start_time: start_time,class_num:class_num});
           
            if (parentNodeId) {
                
                edges.push({ from: parentNodeId, to: nodeId ,class_num:class_num,level:level});
            }

            if (node.children && node.children.length > 0) {
                var childData = convertJsonToVisData(node.children, nodeId);
                nodes = nodes.concat(childData.nodes);
                edges = edges.concat(childData.edges);
            }
        }

        return { nodes: nodes, edges: edges };
    }

    
    var visData = convertJsonToVisData([jsonData], null);

    //将json数据转化适合渲染的数据对象
    function data_convert(visData){
        var nodes = visData.nodes
        var edges = visData.edges
        var colors_div = ['#d5ebe3','#fceaea','#c3ddf6','#87ab69','#75975e','#658354']
        var colors_div2 = ['#9ab69f','#decece','#c3ddf6','#87ab69','#75975e','#658354']
        
        //节点数据转化
        for(let i = 0; i < nodes.length; i++){
            let node = nodes[i];
            let node_convert ={
                id:node.id,
                level:node.level,
                label:node.label,
                href:node.href,
              
                start_time : node.start_time,
                color: {
                    border: colors_div2[node.level],
                    background: colors_div[node.level],
                    highlight: {
                    border: '#',
                    background: '#ffd81b'
                    }
                },
                
                scaling: {
                    min: 10,
                    max: 440,
                    label: {
                    enabled: false,
                    min: 554,
                    max: 3550,
                    maxVisible: 3550,
                    drawThreshold:5
                    },
                },
                title: "click to jump",
                font: {
            
                    size: node.class_num * 12, // 字体大小
                    color: 'black', // 字体颜色
                    face: 'Arial' ,// 字体类型
                    
                    bold:true,
                    multi: false,
                    vadjust: 5,
                    mod: 'bold'
             
                },
                shape:'box',
                
            }
            nodes_convert.add(node_convert);
        }

        //边数据转化
        for(let i = 0; i < edges.length; i++){
            let edge = edges[i];
            let edge_convert ={
                from:edge.from,
                to:edge.to,
                length:100,
                color:{
                    color:colors_div2[edge.level-1],
                   
                },
                width:edge.class_num *5,
                smooth: {
                    type: "cubicBezier",
                    forceDirection: "horizontal",
                    
                  },
                
               
            }
            edges_convert.add(edge_convert);
        }
    }

    //转化数据
    data_convert(visData);
    // 创建 Vis Network 数据对象
    var data_mind = {
        nodes: nodes_convert,
        edges: edges_convert
    };


    var layout = {
        hierarchical: {
            direction: "LR", // 默认从左到右布局
            levelSeparation: max_lines * 550,  

                 
        },  
    };

    var subContainer1 = document.createElement("div");
    subContainer1.id = "subContainer1";
    subContainer1.style.width = "100%";
    subContainer1.style.height = "100%";
    container_map.appendChild(subContainer1);

    /* 创建子容器 */
    var subContainer2_1 = document.createElement("div");
    var subContainer2_2 = document.createElement("div");
    subContainer2_1.className = "graph_tips"

    subContainer2_1.textContent = "Tips:Click mind-map node to jump to \n          the corresponding clip of the video !"
    

    subContainer2_2.style.width = "100%";
    subContainer2_2.style.height = "95%";
    
    // 设置文本换行属性
    subContainer2_1.style.whiteSpace = "pre-wrap";

    // 设置文本左端对齐属性
    subContainer2_1.style.textAlign = "left";


    subContainer1.appendChild(subContainer2_1);
    subContainer1.appendChild(subContainer2_2);


    window.network = new vis.Network(subContainer2_2, data_mind,{layout});




    // 添加事件监听器，以在节点被单击时打开链接
    network.on("click", function (params) {
        if (params.nodes.length > 0) {
            var selectedNodeId = params.nodes[0];
            var selectedNode = data_mind.nodes.get(selectedNodeId);
            var startTime = selectedNode.start_time;
        

            // 阻止默认行为，防止导航到链接地址
        
            // 跳转到视频时间
            jumpToVideoTime(startTime);
            }
        });

    function jumpToVideoTime(jumpTime) {

        // 将毫秒转换为秒
        var jumpSeconds = jumpTime;

        
        // 发送消息到content.js
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "videoplayerjump",data:jumpSeconds});
          });

       
    } 
}
    
