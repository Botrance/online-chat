import { Effect, Reducer } from '@umijs/max';
import { queryFriends, queryRooms } from '@/services/chat';

export interface InfoModelState {
  friends: string[];
  rooms: string[];
}

export interface InfoModelType {
  namespace: 'infoModel';
  state: InfoModelState;
  effects: {
    getFriends: Effect;
    getRooms: Effect;
  };
  reducers: {
    saveFriends: Reducer<InfoModelState>;
    saveRooms: Reducer<InfoModelState>;
  };
}

const InfoModel: InfoModelType = {
  namespace: 'infoModel',
  state: {
    friends: [],
    rooms: [],
  },
  effects: {
    *getFriends(_, { call, put }): Generator<any, void, any> {
      const response = yield call(queryFriends);
      yield put({ type: 'saveFriends', payload: response.friends });
    },
    *getRooms(_, { call, put }): Generator<any, void, any> {
      const response = yield call(queryRooms);
      yield put({ type: 'saveRooms', payload: response.rooms });
    },
  },
  reducers: {
    saveFriends(state, action) {
      return { ...state, friends: action.payload };
    },
    saveRooms(state, action) {
      return { ...state, rooms: action.payload };
    },
  },
};

export default InfoModel;