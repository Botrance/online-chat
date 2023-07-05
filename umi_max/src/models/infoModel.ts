import { Effect, Reducer } from '@umijs/max';
import { queryFriends, queryRooms, queryMsgs } from '@/services/chat';

type friendType = any;
type roomType = any;
type msgType = any;
export interface InfoModelState {
  friends: friendType[];
  rooms: roomType[];
  msgs: msgType[];
}

export interface InfoModelType {
  namespace: 'infoModel';
  state: InfoModelState;
  effects: {
    getFriends: Effect;
    getRooms: Effect;
    getMsgs: Effect;
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

const loadFromStorage = <T>(key: string): T | null | undefined => {
  const data = sessionStorage.getItem(key);
  if (data === null || data === "undefined") {
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
    *getFriends(_, { call, put }) {
      const response: { friends: friendType[] } = yield call(queryFriends);
      yield put({ type: 'saveFriends', payload: response.friends });
    },
    *getRooms(_, { call, put }) {
      const response: { rooms: roomType[] } = yield call(queryRooms);
      yield put({ type: 'saveRooms', payload: response.rooms });
    },
    *getMsgs(_, { call, put }) {
      const response: { msgs: msgType[] } = yield call(queryMsgs);
      yield put({ type: 'saveMsgs', payload: response.msgs });
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