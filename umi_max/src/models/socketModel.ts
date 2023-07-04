import { ws_proxy } from "@/global/config";
import { Socket, io } from "socket.io-client";

export default {
  namespace: 'socketModel',
  state: {
    socket: null,
  },
  reducers: {
    connect(state:any){
      console.log("socket connect success")
      return{
        ...state,
        socket:io(ws_proxy),
      }
    },
    close(state:any){
      console.log("socket connect close")
      if(state.socket){
        state.socket.close();
      }
      return{
        ...state,
        socket:null,
      }
    }
  },

};
