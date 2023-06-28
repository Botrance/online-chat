import { ws_proxy } from "@/global/config";
import { Socket, io } from "socket.io-client";

export default {
  namespace: 'socketModel',
  state: {
    socket: null,
  },

  reducers: {
    loginSuccess(state:any){
      console.log("socket connect success")
      return{
        ...state,
        socket:io(ws_proxy),
      }
    },
    close(state:any){
      console.log("socket connect close")
      state.socket.close();
      return{
        ...state,
        socket:null,
      }
    }
  },

};
