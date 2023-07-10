import { friendType, msgType, roomType } from '@/global/define';
import { queryFriends, queryMsgs, queryRooms } from '@/services/chat';
import { EffectsCommandMap, Reducer } from '@umijs/max';

export interface InfoModelState {
  friends: friendType[];
  rooms: roomType[];
  msgs: msgType[];
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
    ) => Generator<any, void, { rooms: any[] }>;
    getMsgs: (
      action: { payload: { username: string; roomId: string } },
      effects: EffectsCommandMap,
    ) => Generator<any, void, { msgs: any[] }>;
    clearStorage: (
      _: any,
      effects: EffectsCommandMap,
    ) => Generator<any, void, any>;
  };
  reducers: {
    saveFriends: Reducer<InfoModelState, SaveAction<friendType[]>>;
    saveRooms: Reducer<InfoModelState, SaveAction<roomType[]>>;
    saveMsgs: Reducer<InfoModelState, SaveAction<msgType[]>>;
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

const saveToStorage = (key: string, data: any) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

const InfoModel: InfoModelType = {
  namespace: 'infoModel',
  state: {
    friends: [],
    rooms: [],
    msgs: [],
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
      { call, put },
    ) {
      const { username, roomType, timestamp } = payload; // 从 payload 中获取 username 参数
      try {
        console.log('Sending request: queryRooms');
        const response: { rooms: roomType[] } = yield call(
          queryRooms,
          username,
          roomType,
          timestamp,
        ); // 调用 queryRooms，并传递 username 参数
        yield put({ type: 'saveRooms', payload: response.rooms });
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        yield put({ type: 'saveRooms', payload: [] }); // 处理错误情况，保存一个空数组作为 rooms 状态
      }
    },
    *getMsgs(
      { payload }: { payload: { username: string; roomId: string } },
      { call, put },
    ) {
      const { username, roomId } = payload;
      const response: { msgs: msgType[] } = yield call(
        queryMsgs,
        username,
        roomId,
      );
      yield put({ type: 'saveMsgs', payload: response.msgs });
    },
    *clearStorage(
      _,
      { put, call, select }: EffectsCommandMap,
    ): Generator<any, void, any> {
      sessionStorage.removeItem('infoModel.friends');
      sessionStorage.removeItem('infoModel.rooms');
      sessionStorage.removeItem('infoModel.msgs');
      yield put({ type: 'saveFriends', payload: [] });
      yield put({ type: 'saveRooms', payload: [] });
      yield put({ type: 'saveMsgs', payload: [] });
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
    saveMsgs(state, action) {
      const newState: InfoModelState = { ...state, msgs: action.payload };
      saveToStorage('infoModel.msgs', newState.msgs);
      return newState;
    },
  },
};

const savedFriends = loadFromStorage<friendType[]>('infoModel.friends');
if (savedFriends) {
  InfoModel.state.friends = savedFriends;
}

const savedRooms = loadFromStorage<roomType[]>('infoModel.rooms');
if (savedRooms) {
  InfoModel.state.rooms = savedRooms;
}

const savedMsgs = loadFromStorage<msgType[]>('infoModel.msgs');
if (savedMsgs) {
  InfoModel.state.msgs = savedMsgs;
}

export default InfoModel;
