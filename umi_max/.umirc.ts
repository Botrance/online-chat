import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  model: {},
  initialState: {},
  request: {},
  dva: {},
  mock: false,
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '登录页面',
      path: '/login' ,
      component: './Login',
    },
    {
      name: '聊天页面',
      path: '/chat' ,
      component: './Chat',
    }
  ],
  npmClient: 'pnpm',
});

