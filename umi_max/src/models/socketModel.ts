import { ws_proxy } from '@/global/config';
import { Reducer } from '@umijs/max';
import { Socket, io } from 'socket.io-client';

export interface SocketModelState {
  socket: Socket | null;
}

export interface SocketModelType {
  namespace: 'socketModel';
  state: SocketModelState;
  reducers: {
    connect: Reducer<SocketModelState>;
    close: Reducer<SocketModelState>;
  };
}

const SocketModel: SocketModelType = {
  namespace: 'socketModel',
  state: {
    socket: null,
  },
  reducers: {
    connect(state) {
      console.log('socket connect success');
      return {
        ...state,
        socket: io(ws_proxy) as Socket,
      };
    },
    close(state) {
      console.log('socket connect close');
      if (state.socket) {
        state.socket.close();
      }
      return {
        ...state,
        socket: null,
      };
    },
  },
};

export default SocketModel;
