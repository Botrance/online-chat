# online-chat

本项目是一款基于网页端的即时通讯程序。  
前端架构使用 umi max+ react ， 组件库采用 antd pro ，状态管理使用 dva。  
后端使用 koa 做服务器 ，数据库为 mysql ，使用 sqeulize 做链接 ，redis 作数据缓存。  
使用 socket.io 做长连接。

程序功能正在不断完善中，项目启动过程为：  

1. umi_max 文件夹中运行 pnpm i
2. umi_server 文件夹中运行 npm i
3. umi_max 文件夹中运行 pnpm run dev
4. umi_server 文件夹中运行 node server.js 或 nodemon.js
5. 运行本地的redis服务器，默认端口

后续考虑将服务器部署到线上并使用docker  
账号一般存在 3 ~ 4 个 ： Botrance ， yujiawang ，test ， fushizhang ，默认密码为 000000  
程序功能：  

1. 登录与注册（需要完善：记住密码，验证码，第三方登录，更多用户信息存储）
2. 进入房间并发送接收信息
3. 搜索用户并添加好友，搜索请点击加号下的菜单选项，搜索框暂未支持
4. 显示好友列表与群聊列表

具体开发过程 详见 dev 文档 ，文件结构见各文件夹下的 readme
