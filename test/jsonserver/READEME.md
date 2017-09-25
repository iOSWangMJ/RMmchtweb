#### json-server 使用说明
##### 安装
    npm install -g json-server
[主页：](https://github.com/typicode/json-server)

##### 使用
    #json-server --watch staticLoad.json --port 3004
    监听3004端口 使用 名为staticLoad.json的文件
    本目录下包含一个run.bat文件可以直接双击执行
   
##### 配合WEBPACK代理定向配置
    /config/index.js
`proxyTable: {
         '/static': {   //将/static请求定向到http://localhost:3004
             target: 'http://localhost:3004',
             pathRewrite: {
                 '^/static': '/static'  //对应target也是相同的路径
             }
         },
         …………
     },`    
     
##### 注意
     系统在运行中可能会有功能访问后台，如影响到开发，请添加对应接口
    
