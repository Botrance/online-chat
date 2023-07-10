import { authToken } from '@/services/apiTest';
import { Effect, Reducer, Subscription } from '@umijs/max';
export interface AuthModelState {
  auth: boolean|undefined;
}

export interface AuthModelType {
  namespace: 'authModel';
  state: AuthModelState;
  reducers: {
    updateState: Reducer<AuthModelState>;
    loginSuccess: Reducer<AuthModelState>;
  };
  effects: {
    getAuth: Effect;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const AuthModel: AuthModelType = {
  namespace: 'authModel',
  state: {
    auth: undefined,
  },
  reducers: {
    updateState(state, { payload }) {
      if (state.auth !== payload.auth) {
        return {
          ...state,
          ...payload,
        };
      }
      return state;
    },
    loginSuccess(state) {
      console.log('success');
      return {
        ...state,
        auth: true,
      };
    },
  },
  effects: {
    *getAuth({ payload }, { call, put }) {
      const data: boolean = yield call(authToken, payload);
      yield put({
        type: 'updateState',
        payload: {
          auth: data,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      // 在初始化时调用 getAuth 方法
      dispatch({ type: 'getAuth' });
    },
  },
};

export default AuthModel;
