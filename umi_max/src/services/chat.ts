import { request } from '@umijs/max';

export async function queryFriends(username: string, timestamp: number) {
  try {
    console.log('Sending request: queryFriends');
    const response = await request('/api/chat/friend/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { timestamp, username },
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch friends:', error);
    return [];
  }
}

export async function queryRooms(
  username: string,
  roomType: string,
  timestamp: number,
) {
  try {
    console.log('Sending request: queryRooms');
    const response = await request('/api/chat/room/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { timestamp, username, roomType },
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    return [];
  }
}

export async function queryMsgs(
  roomId: string,
  startTime: number,
  endTime: number,
) {
  try {
    console.log('Sending request: queryMsgs');
    const response = await request('/api/chat/msg/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { startTime, endTime, roomId },
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
}

// 匹配好友
export async function matchFriends(matchStr: string) {
  try {
    console.log('Sending request: matchFriends');
    const response = await request('/api/chat/friend/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { matchStr: matchStr }, // 使用matchStr作为用户名进行匹配
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch friends:', error);
    return [];
  }
}

// 匹配房间
export async function matchRooms(matchStr: string) {
  try {
    console.log('Sending request: matchRooms');
    const response = await request('/api/chat/room/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { matchStr: matchStr }, // 使用matchStr作为房间名进行匹配
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    return [];
  }
}