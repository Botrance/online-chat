## **05.10**

### umi 实例
使用 umi + antd pro 开发前端代码  
新建登录页面，使用 antd pro，路由使用 umi 自带的配置式路由，  
先使用 mock 进行接口调试， login 组件添加 request 方法，  
调试成功后使用 Postman 模拟实际调用，并在 umirc 中禁用 mock。    
新建后端文件夹， 使用 koa + sequelize + koa-router + mysql 搭建，  
使用 bodyParser 进行解析， cor 解决跨域，   
同时使用 jwt 生成 token 鉴权。  
安装 mysql 建库与表，进行调试，使用 sequlize 建立模型。  
添加 koa 路由 ，配置监听，将 sequlize 挂载到 koa 上 {require("./utils/socket")(server);}  

## **05.11**
将 jwt 的生成与鉴别部分分离出来，  
为 koa 路由建立 routes 文件夹 ，分离路由 auth 作为账号管理。  
建立 login 和 register 的接口使用 Postman 调试可用性，建立 auth 表 ，
auth 表结构为（id，accountName，password），使用 postman 进行注册登录，      
在 mysql 中查看表是否符合要求，查看服务器 console 是否正确，查看响应头是否返回正确code 。
code：{100：成功，101：失败，110：参数导致错误，111：参数不合法}  
id 和 密码使用 crypto 的 md5 进行加密。  
!!! 在服务端数据库查询要写异步+await ，否则响应头直接返回。  
可以使用 Sequelize-Automate 来自动导出模型。  
使用 token + sessionStorage + 请求拦截，控制访问权限。       
新建 chat 页面，使用 socket.io 进行初步的消息通信。

## **05.12**
auth 数据表启用时间戳。  
添加 initTable 方法 ，检测并初始化数据表。  
使用 dva 进行全局状态管理，添加 auth 属性进行监听。  
添加鉴权拦截路由，通过获取 dva 中存储的 auth 鉴别，未登录访问部分页面跳转回上一页。   
使用 dva 的 subscriptions 监听 hitory 变化，自动发送请求鉴别 token。   
前后端联合调试，完成 token 部分。

## **05.15**
增加 message 数据表（id，user_sender,user_receiver,message,timestamp）, 
分离 initTable ，根据传入的参数自动检测初始化。  
message 的时间字段使用客户端传递过来的时间，便于后面的同步。  
增加 message 的 model 和 chat 路由 ，前端添加对应接口，进行初步调试，
在 mysql 中确认调试成功后，将接口迁移到 socket.js 中，使用 ws 通信，  
在前端 chat 页面协调好接口，改为ws通信。
调试完成 socket.io 双向通信。   

## **05.16**
添加 room 数据表，考虑到拓展性用（id，users，timestamp）进行存储，  

需求：首先，每次前端进入房间发起 roomConnect 请求，然后服务端根据接收的 id 启动 sendMsg 监听，  
前端离开房间发起 roomLeave 请求，离开当前房间

## **05.22**
将 socket 用 dva 存储，保证单例连接。
修复了 token 验证因为同步问题刷新页面后不生效。
问题：打包后的 dist 因为使用 browserRouter 导致404,配置 exportStatic:{} 即可。
涉及 jwt 安全问题 ： refreshtoken（实际意义不大），唯一登陆设备绑定，二级密码验证码

## **05.24**
将路由拦截改为函数组件，使用 show 控制 Outlet 渲染， useEffect 中异步请求更改 state。  

## **06.28**
增加socketModel，防止新建多个socket请求，修改auth验证逻辑  

## **07.04**
增减infoModel，存储freiends列表和rooms列表，修改数据表结构，调整socket代码  
初步调试消息发送功能

## **07.05**
model添加类型注明  
修改模型authModel为userModel，添加user-room关联表  
修改表结构，修改auth系列借口为user接口，添加一系列room接口  
房间系列接口初步调试成功  
添加token验证，koa路由部分为调试方便暂不启用  
获取房间列表接口调试成功

## **07.07**
给msg添加索引字段roomId

## **07.10**
修改权限验证逻辑，修复了apiToken可能返回undefiend的问题  
通用布局页面建立  
添加全局定义  
修改各个路由样式  
修复查询消息不生效的问题  
修改room的获取逻辑，还需要在model中进行code判断  
修改房间查询，参数需要按顺序  

todo:
1. 消息显示与分页查询
2. ~~房间和朋友拉取时先判断timestamp~~ 07.11
3. 房间添加置顶
4. 考虑修改输入框，输入框需要暂留数据
5. 房间头像，用户头像, 搜索框
6. chatpage sider top加上个性签名,
7. 字体修改
8. 考虑添加页面缓存      
9. 房间悬浮变色添加消息条数：badge、免打扰：考虑roomUser添加已读未读字段
10. redis中间件
11. 线上部署
12. nginx分流  
13. 登陆验证码，第三方登陆
14. 好友分组，群聊分组与特别关心
15. 响应式布局
16. ~~注册~~
17. 设置页面
18. 添加删除好友
19. 账号管理
20. 帮助
21. 注册成功与失败添加反馈
22. @功能
23. 群聊成员渲染