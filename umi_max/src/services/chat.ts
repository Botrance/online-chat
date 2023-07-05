import { request } from '@umijs/max';

export async function queryFriends() {
  try {
    const response = await request('/chat/friend/query', {
      method: 'POST',
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

export async function queryRooms(username: string) {
  try {
    const response = await request('/chat/room/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ username }),
      responseType: 'json', // 将响应数据解析为JSON格式的数组
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    return [];
  }
}

export async function queryMsgs(timestamp: number, roomId: string) {
  try {
    const response = await request('/chat/message/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ timestamp, roomId }), // 将参数转换为JSON字符串并发送
      responseType: 'json', // 将响应数据解析为JSON格式的数组
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
}
