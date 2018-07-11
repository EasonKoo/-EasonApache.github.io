//自己利用自己电脑构建一台服务器来响应http请求
let http = require("http")

//引入路径模块
let path = require("path");

//引入文件模块
let fs = require("fs");

//引入设置文件类型插件

let mime = require("mime");

//引入查询字符串模块
//let queryString = require("querystring")

//设置电脑的根目录
let rootPath = path.join(__dirname,"www");

http.createServer(function(request,response){
    //浏览器会对中文进行编码,读取不到路径,所以要解码回来;所以结果是要用string

    let filePath = path.join(rootPath,queryString.unescape(request.url));//这句话的意思是获取用户输入的的文件名
    console.log(filePath);
    
    //判断用户请求的文件存不存在
    let ifExist = fs.existsSync(filePath);

    if(ifExist){
        //文件存在的话
        //文件是目录还是文件
        fs.readdir(filePath,(err,files)=>{
            if(err){
                //说明是文件
                fs.readFile(filePath,(err,data)=>{
                    if(err){
                        console.log(err);         
                    }else{
                        response.writeHead(200, {
                            "content-type": mime.getType(filePath)
                           
                          });
                        response.end(data)
                    }
                })
            }else{
                //说明是目录
                let backdata="";
                //如果有首页,
                if(files.indexOf("index.html")!=-1){
                    //就把首页读出来然后返回给浏览器
                    fs.readFile(path.join(filePath,"index.html"),(err,data)=>{
                        if(err){
                            console.log(err);         
                        }else{
                            response.writeHead(404, {
                                "content-type": "text/html;charset=utf-8"
                              });
                            response.end(data)
                        }
                    })
                }//如果没有首页
                else{
                   //console.log(files);
                     
                    for(let i =0;i<files.length;i++){
                        //模板字符串可以嵌入变量
                        backdata+= `<h2><a href="${request.url=="/"?"":request.url}/${files[i]}">${files[i]}</a></h2>`
                    }
                    response.writeHead(200, {
                        "content-type": "text/html;charset=utf-8"
                      });
                   //console.log(backdata);
                    response.end(backdata)

                }
            }
        })

    }else{
        //设置返回状态和请求的状态
        response.writeHead(404, {
            "content-type": "text/html;charset=utf-8"
          });
        response.end(`<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
        <html><head>
        <title>404 Not Found</title>
        </head><body>
        <h1>Not Found</h1>
        <p>The requested URL was not found on this server.</p>
        </body></html>`)
    }
    

}).listen(80,"192.168.72.74",function(){
    console.log("success");
})