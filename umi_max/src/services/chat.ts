import { request } from '@umijs/max';

export async function queryFriends(userId: number, timestamp: number) {
  try {
    console.log('Sending request: queryFriends');
    const response = await request('/api/chat/friend/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { timestamp, userId },
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch friends:', error);
    return [];
  }
}

export async function queryRooms(
  userId: number,
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
      data: { timestamp, userId, roomType },
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
      data: { matchStr }, // 使用matchStr作为用户名进行匹配
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
      data: { matchStr }, // 使用matchStr作为房间名进行匹配
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    return [];
  }
}

// 添加好友
export async function addFriend(majorId: number, minorId: number) {
  try {
    console.log('Sending request: addFriend');
    const response = await request('/api/chat/friend/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { majorId, minorId }, // 使用matchStr作为房间名进行匹配
    });
    return response;
  } catch (error) {
    console.error('Failed to add friend:', error);
    return [];
  }
}

// 加入群聊
export async function joinRoom(userId: number, roomId: number) {
  try {
    console.log('Sending request: joinRoom');
    const response = await request('/api/chat/room/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { userId, roomId }, // 使用matchStr作为房间名进行匹配
    });
    return response;
  } catch (error) {
    console.error('Failed to join room:', error);
    return [];
  }
}

// 创建群聊
export async function createRoom(majorId: number|number[], roomName?: string ,roomType?:string) {
  try {
    console.log('Sending request: createRoom');
    const response = await request('/api/chat/room/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { majorId, roomName }, // 使用matchStr作为房间名进行匹配
    });
    return response;
  } catch (error) {
    console.error('Failed to create room:', error);
    return [];
  }
}
