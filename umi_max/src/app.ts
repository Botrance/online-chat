// 运行时配置
import type { RequestConfig } from '@umijs/max';
import { proxy } from '@/global/config';

export const request: RequestConfig = {
  timeout: 1000,
  // other axios options you want
  errorConfig: {
    errorHandler(err) {
      console.log(err);
    },
    errorThrower() {},
  },
  requestInterceptors: [
    (config: any) => {
      const sessionToken = sessionStorage.getItem('token');
      const urlReg= /^\/api/;
      let url=config.url.replace(urlReg,proxy);
      if (sessionToken) return {...config,
        url:url,
        headers:{
        'Authorization': 'Bearer ' + sessionToken.toString()
      }};
      return config;
    },
  ],
  responseInterceptors: [],
};

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
  };
};
