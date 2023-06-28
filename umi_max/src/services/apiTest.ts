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
  request('/api/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(function (response: any) {
    console.log(response);
  });
};

export const authToken = async () => {
  console.log('authToken');
  const result = await request('/api/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(function (response: any) {
      console.log(response.msg);
      return response.code === 100;
    })
    .catch((reason) => {
      console.log(reason);
      return false;
    });
  if (result) return result;
};
