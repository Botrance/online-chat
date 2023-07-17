import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  model: {},
  request: {},
  dva: {},
  mfsu: {},
  mock: false,
  layout: false,
  exportStatic: {},
  routes: [
    {
      name: '主页面',
      path: '/',
      component: './Main',

      routes: [
        {
          path: '/',
          exact: true,
          redirect: '/login',
        },
        {
          name: '登录页面',
          path: '/login',
          component: './Login',
        },
        {
          name: '注册页面',
          path: '/register',
          component: './Register',
        },
        {
          path: '/',
          component: '@/components/home',
          wrappers: ['@/utils/auth'],
          routes: [
            {
              name: '聊天',
              path: '/chat',
              component: './Chat',
            },
            {
              name: '关系',
              path: '/relation',
              component: './Relation',
            },
          ],
        },
      ],
    },
  ],
  npmClient: 'pnpm',
});
