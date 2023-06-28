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

  // subscriptions: {
  //   sendAjax({ dispatch, history }: any) {
  //     history.listen(({ pathname }: any) => {
  //       dispatch({
  //         type: 'getAuth',
  //       });
  //     });
  //   },
  // },
};
