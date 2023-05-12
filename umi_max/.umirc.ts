import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  model: {},
  request: {},
  dva: {},
  mock: false,
  layout: false,
  routes: [
    {
      name:'主页面',
      path: '/',
      component: './Main',
      
      routes:[
        {
          path:'/',
          exact:true,
          redirect:'/login'
        },
        {
          name: '登录页面',
          path: '/login',
          component: './Login',
        },
        {
          name: '首页',
          path: '/home',
          component: './Home',
        },
        {
          name: '聊天页面',
          path: '/chat',
          component: './Chat',
          wrappers:['@/utils/auth',],
        },
      ]
    },
   
  ],
  npmClient: 'pnpm',
});
