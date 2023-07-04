import { authToken } from '@/services/apiTest';

export default {
  namespace: 'authModel',
  state: {
    auth: false,
  },

  reducers: {
    updateState(state: any, { payload }: any) {
      if (state.auth !== payload.auth) {
        return {
          ...state,
          ...payload,
        };
      }
      return state;
    },
    loginSuccess(state: any) {
      console.log('success');
      return {
        ...state,
        auth: true,
      };
    },
  },

  effects: {
    *getAuth({ payload }: any, { call, put }: any) {
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
    setup({ dispatch }: any) {
      // 在初始化时调用 getAuth 方法
      dispatch({ type: 'getAuth' });
    },
  },
};
