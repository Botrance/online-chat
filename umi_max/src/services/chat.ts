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
