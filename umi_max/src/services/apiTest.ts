import { request } from '@umijs/max';

export const test = async () => {
  request('/api/auth/test', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(function (response: any) {
    console.log(response);
  });
};

export const testToken = async () => {
  request('/api/auth/test/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(function (response: any) {
    console.log(response);
  });
};
