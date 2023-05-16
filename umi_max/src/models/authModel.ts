import { authToken } from '@/services/apiTest';

export default {
  namespace: 'authModel',
  state: {
    auth: false,
  },

  reducers: {
    updateState(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
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
    sendAjax({ dispatch, history }: any) {
      history.listen(({ pathname }: any) => {
        if (pathname !== '/login' && pathname !== '/') {
          dispatch({
            type: 'getAuth',
          });
        }
      });
    },
  },
};
