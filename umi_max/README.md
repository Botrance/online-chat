# umi_max

前端架构使用 umi max + react + ts + less ， 组件库采用 antd pro ，状态管理使用 dva。  

项目结构：  

    .umirc.ts 路由配置 ， 使用 token 验证做路由权限验证  
    src：  
        app.ts 用拦截器为请求添加 token ， 并打印响应  

        assets 存放静态资源  

        components 存放公共组件，目前有 home 组件为核心界面组件 ，icon 组件统一导出图标
                mapList 存放渲染列表逻辑 ， search 为搜素组件 ， softTab 为自定义封装页签  

        global 存放全局样式，统一定义与统一端口配置

        models 存放 dva 模型，authModel 负责token验证 ， infoModel 负责消息存储与获取 ，  
            socketModel 负责服务单例化与连接断开  

        pages 存放路由组件 Main 为 公共顶级路由，负责打印路由跳转信息 ， Login 与 Register  
            为登陆和注册页面 ， Chat 与 Relation 一个是聊天功能带房间列表，一个是好友列表加群聊列表  

        services 存放封装的请求函数  

        utils 存放工具函数
