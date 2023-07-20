# umi_server

项目使用 koa 做服务器 ，数据库为 mysql ，使用 sqeulize 做链接 ，redis 作数据缓存 ，
使用 socket.io 做长连接。  

项目结构：  

+ config ： 配置文件夹 ， 目前存放数据库的配置文件，可选择本地或者在线的数据库导出。  
+ model : 数据库模型文件夹  ， 存放定义的数据表模型 ， 子文件夹 related 存放关联表 ，
        目前有 user msg room 表 ， 以及 user-room 存放群的成员 ， user-user 存放好友。  
+ routes ： 路由文件夹 ， 子路由 user 与 chat ， user 对注册和登陆 ，chat 对应 子文件夹
              chat下的三个子路由，实现 room ， friend ，msg 的对应功能 ， CRUD 以及其他功能。
+ utils ： 存放工具函数 ， initTable.js 为初始化数据表并同步的函数 ，jwt.js 封装的 token 相关函数  
             socket.js 为挂载的 socket.io 运行逻辑 ， tool.js 待添加工具函数  
+ server.js： 服务器主程序 ， 挂载 koa ， mysql ， redis ， socket.io

默认状态码，ctx与socket的resMsg接口都会返回这个
    code: 100:成功 101：失败 102：成功但是没有获取到值 110：参数不正确导致执行失败  
    msg: 对应的反馈信息  
为方便调试 ， 路由对应的接口暂未启用 token 验证  
