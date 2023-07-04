import { request } from '@umijs/max';

export async function queryFriends() {
  try {
    const response = await request('/chat/getFriends', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json', // 将响应数据解析为JSON格式的数组
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch friends:', error);
    return [];
  }
}

export async function queryRooms() {
  try {
    const response = await request('/chat/getRooms', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json', // 将响应数据解析为JSON格式的数组
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    return [];
  }
}