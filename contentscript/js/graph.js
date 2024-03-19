var flag_render = false;

function renderGraph(nodes,edges){

    //定义数据转变后的节点和边数据集合
    var nodes_convert = new vis.DataSet();
    var edges_convert = new vis.DataSet();

  
    function data_convert(nodes,edges)
    {
        
        var index_key1,index_key2;
        var nodes_key1 = [];
        var nodes_key2 = [];
        index_key1 = edges[0]['to'];
        index_key2 = -1;
        var flag = 0;
        for(let j=0;j<edges.length;j++){
            let temp = edges[j]['to'];
            if(temp == index_key1){
                nodes_key1.push(edges[j]['from']);
                
            }
            else{
                nodes_key2.push(edges[j]['from']);
            }
            if(temp != index_key1 && flag==0){
                index_key2 = temp;
                flag = 1;
            }
            
            
        }

    
        //var colors_div = ['#9dd4d1','#9ac49b','#b2cf87','#a5def1','#f4d8df']
        var colors_div = ['#a5def1','#9ac49b','#9ac49b','#a5def1','#f4d8df']
        for(let i=0;i<nodes.length;i++){
            let node = nodes[i];
            let index = node['id']
            node.fontsize = 25;

            var keyWords= node.label;
            if(keyWords.length >= 4){
                node.fontsize = 17
            }
            var label = ''; // 初始化 label
            for (var k = 0; k < keyWords.length; k++) {
                label += keyWords[k];
                
                if (((k + 1) % 3 == 0)&&(k != 0)&&(flag_render == false)) {

                    if( keyWords.length !=3 && k != 5){

                        label += '\n'; // 在每6个字符后添加一个换行符

                    }
                    
                }
            }

            node.label = label
           
            node.borderDashes = false;
            node.borderDashes = [2, 10]
         
            node.bordercolor = '#a5d9d7'
            node.hover = {
                color: {
                    background: 'yellow',
                }
            };

            if(index == index_key1){
              
                node.color = colors_div[0]
                node.fontsize =  '30'
                node.shape = 'circle'
                node.borderWidth = 10
                node.borderWidthSelected = 15
                node.bordercolor = '#feec6e'
                
            }
            else if(index == index_key2){
               
                node.color = colors_div[1]
                node.fontsize = '30'
                node.shape = 'circle'
                node.borderWidth = 10
                node.borderWidthSelected = 15
                node.bordercolor = '#71e8d2'
            }
            else{
                if(nodes_key1.indexOf(index)==-1)
                {
                    node.color = colors_div[3];
                }
                else{
                    if(nodes_key2.indexOf(index) != -1){
                        node.color = colors_div[4];
                    }
                    else{
                        node.color = colors_div[2];
                    }
                    
                }
            }

            var node_convert = {
                id: node.id,
                label: node.label,
                // shape:'circle',
                shape: node.shape,
                borderWidth: 0.5,
                borderWidthSelected: 3,
                
                title: "Double-click to view related video list",

                color: {
                    background: node.color,
                    highlight: {
                    border: '#',
                    background: '#ffd81b'
                    }
                },
                font: {
                    size: node.fontsize, // 字体大小
                    color: 'black', // 字体颜色
                    face: 'Arial' ,// 字体类型
                    
                    bold:true,
                    
                    strokeWidth: 0, // px
                    strokeColor:'#fcf4ab',
                    
                    multi: false,
                    vadjust: 5,
             
                },
                
                
                };
            nodes_convert.add(node_convert); // 将节点添加到节点数组中
                
            }


        for(let k=0;k<edges.length;k++){
            let edge = edges[k];
            let edge_color;
            if(edge.to == index_key1){
                edge_color = '#9cc6a2'
            }
            else{
                edge_color = '#50a7c2'
            }
            
            var edge_convert = {
                from:edge.from,
                to:edge.to,
                width: 5,
                
                color: { color: edge_color, highlight: '#313866' }, 
                
                arrows: {
                    to: {
                      enabled: true, 
                      scaleFactor: 0.5, 
                      type: 'bar'
                    },
                       
                  },

            
                chosen:Object,
                chosen:{
                    edge: function(values, id, selected, hovering){
                        values.toArrowType = 'circle';
                    }
                },
                smooth: { enabled: true, type: 'dynamic' },
        
            };
            
            edges_convert.add(edge_convert);

        }
    }
    data_convert(nodes,edges)
    flag_render = true;
    // 获取用于渲染图形的容器
    var container = document.getElementById("contentContainer");
    // 构建图形数据
    var data2 = {
        nodes: nodes_convert,
        edges: edges_convert
    };

    // 设置图形展示选项
    var options = {
     
        physics: {
            enabled: true
        },
        interaction: {
            hover: true, // Enable hover interaction
        }
        
    };



    function related_video(label){
         // 发送相关视频跳转消息到content.js
         chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "related_video",data:label});
          });
        
    }

    var subContainer2 = document.createElement("div");
    subContainer2.id = "subContainer2";
    subContainer2.style.width = "100%";
    subContainer2.style.height = "100%";
    container.appendChild(subContainer2);
    
    /* 创建子容器 */
    var subContainer2_1 = document.createElement("div");
    var subContainer2_2 = document.createElement("div");
    subContainer2_1.className = "graph_tips"

    subContainer2_1.textContent = "Tips:Double-click graph node to \n          view related videos list !"

    subContainer2_2.style.width = "100%";
    subContainer2_2.style.height = "95%";
    
    // 设置文本换行属性
    subContainer2_1.style.whiteSpace = "pre-wrap";

    // 设置文本左端对齐属性
    subContainer2_1.style.textAlign = "left";

    subContainer2.appendChild(subContainer2_1);
    subContainer2.appendChild(subContainer2_2);


    
    try {
        window.network = new vis.Network(subContainer2_2, data2, options);
        // 将双击事件绑定到节点
        network.on("doubleClick",function(params){
            
            if (params.nodes.length > 0) {
                var selectedNodeId = params.nodes[0];
                var selectedNode = data2.nodes.get(selectedNodeId);
                
                related_video(selectedNode.label)
                }

        });
    } catch (error) {
        console.error("Error initializing vis.js network:", error);
    }
          
}