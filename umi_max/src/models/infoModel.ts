import { friendType, markMsgType, msgType, roomType } from '@/global/define';
import { queryFriends, queryMsgs, queryRooms } from '@/services/chat';
import { EffectsCommandMap, Reducer } from '@umijs/max';

export interface InfoModelState {
  friends: friendType[];
  rooms: roomType[];
  markMsgs: markMsgType[];
}

export interface InfoModelType {
  namespace: 'infoModel';
  state: InfoModelState;
  effects: {
    getFriends: (
      action: { payload: { username: string } },
      effects: EffectsCommandMap,
    ) => Generator<any, void, { friends: any[] }>;
    getRooms: (
      action: {
        payload: { username: string; roomType: string; timestamp: number };
      },
      effects: EffectsCommandMap,
    ) => Generator<any, void, { code: number; rooms: any[] }>;
    getMsgs: (
      action: {
        payload: {
          roomId: string;
          startTime: number;
          endTime: number;
        };
      },
      effects: EffectsCommandMap,
    ) => Generator<any, void, { code: number; msg: string; result: msgType[] }>;
    updateMarkMsgs: (
      action: {
        payload: { roomId: string; updateTime: number };
      },
      effects: EffectsCommandMap,
    ) => Generator<any, void, any>;
    clearStorage: (
      _: any,
      effects: EffectsCommandMap,
    ) => Generator<any, void, any>;
  };
  reducers: {
    saveFriends: Reducer<InfoModelState, SaveAction<friendType[]>>;
    saveRooms: Reducer<InfoModelState, SaveAction<roomType[]>>;
    saveMarkMsgs: Reducer<InfoModelState, SaveAction<markMsgType[]>>;
  };
}

interface SaveAction<T> {
  type: string;
  payload: T;
}

export const loadFromStorage = <T>(key: string): T | null | undefined => {
  const data = sessionStorage.getItem(key);
  if (data === null || data === 'undefined') {
    return null;
  }
  return JSON.parse(data);
};

export const saveToStorage = (key: string, data: any) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

const InfoModel: InfoModelType = {
  namespace: 'infoModel',
  state: {
    friends: loadFromStorage<friendType[]>('infoModel.friends') || [],
    rooms: loadFromStorage<roomType[]>('infoModel.rooms') || [],
    markMsgs: loadFromStorage<markMsgType[]>('infoModel.markMsgs') || [],
  },
  effects: {
    *getFriends({ payload }: { payload: { username: string } }, { call, put }) {
      const { username } = payload;
      const response: { friends: friendType[] } = yield call(
        queryFriends,
        username,
      );
      yield put({ type: 'saveFriends', payload: response.friends });
    },
    *getRooms(
      {
        payload,
      }: { payload: { username: string; roomType: string; timestamp: number } },
      { call, put, select },
    ) {
      const { username, roomType, timestamp } = payload;
      const { rooms } = yield select((state: InfoModelState) => state);

      try {
        console.log('Sending request: queryRooms');
        const response: {
          code: number;
          rooms: roomType[];
        } = yield call(
          queryRooms,
          username,
          roomType,
          !rooms ? undefined : timestamp, // 如果 rooms 数组为空，则不传递 timestamp 参数
        );
        if (response.code === 100) {
          yield put({ type: 'saveRooms', payload: response.rooms });
        }
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        yield put({ type: 'saveRooms', payload: [] }); // 处理错误情况，保存一个空数组作为 rooms 状态
      }
    },
    *getMsgs(
      {
        payload,
      }: {
        payload: {
          roomId: string;
          startTime: number;
          endTime: number;
        };
      },
      { call, put, select },
    ) {
      const { roomId, startTime, endTime } = payload;

      const response = yield call(queryMsgs, roomId, startTime, endTime);

      // 更新 markMsgs 数据
      if (response.code === 100) {
        saveToStorage(`infoModel.msgs.${roomId}`, response.result);
        yield put({
          type: 'updateMarkMsgs',
          payload: { roomId, updateTime: endTime || startTime },
        });
      }
    },
    *updateMarkMsgs({ payload }, { put, select }) {
      const { roomId, updateTime } = payload;

      const markMsgs: markMsgType[] = yield select(
        (state: InfoModelState) => state.markMsgs,
      );

      if (markMsgs) {
        const existingMarkMsgIndex = markMsgs.findIndex(
          (item) => item.roomId === roomId,
        );
        if (existingMarkMsgIndex !== -1) {
          markMsgs[existingMarkMsgIndex].updateTime = updateTime;
        } else {
          markMsgs.push({ roomId, updateTime });
        }
        yield put({ type: 'saveMarkMsgs', payload: markMsgs });
      } else
        yield put({ type: 'saveMarkMsgs', payload: [{ roomId, updateTime }] });
    },
    *clearStorage(
      _,
      { put, call, select }: EffectsCommandMap,
    ): Generator<any, void, any> {
      sessionStorage.removeItem('infoModel.friends');
      sessionStorage.removeItem('infoModel.rooms');
      sessionStorage.removeItem('infoModel.markMsgs');
      const keys = Object.keys(sessionStorage);
      keys.forEach((key) => {
        if (key.startsWith('infoModel.msgs.')) {
          sessionStorage.removeItem(key);
        }
      });
      yield put({ type: 'saveFriends', payload: [] });
      yield put({ type: 'saveRooms', payload: [] });
      yield put({ type: 'saveMarkMsgs', payload: [] });
    },
  },
  reducers: {
    saveFriends(state, action) {
      const newState: InfoModelState = { ...state, friends: action.payload };
      saveToStorage('infoModel.friends', newState.friends);
      return newState;
    },
    saveRooms(state, action) {
      const newState: InfoModelState = { ...state, rooms: action.payload };
      saveToStorage('infoModel.rooms', newState.rooms);
      return newState;
    },
    saveMarkMsgs(state, action) {
      const newState: InfoModelState = { ...state, markMsgs: action.payload };
      saveToStorage('infoModel.markMsgs', newState.markMsgs);
      return newState;
    },
  },
};

export default InfoModel;
