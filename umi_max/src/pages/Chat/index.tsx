import { ws_proxy } from '@/global/config';
import { ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const ChatPage: React.FC = () => {
  // 绑定监听, 接收服务器发送的消息
  const socket = io(ws_proxy);
  
  useEffect(() => {
    // componentDidMount
    socket.on('receiveMsg', function (data) {
      console.log('客户端接收服务器发送的消息', data);
    });
    return () => {
      // componentWillUnmount
      socket.off('message', function (data) {
        console.log('关闭socket链接', data);
      });
    };
  }, [socket]);

  const ioEmit= async(values:{text:string})=>{
    // 发送消息
    socket.emit('sendMsg', {name: values.text})
    console.log('客户端向服务器发消息', {name: values.text})

  }


  return (
    <>
      <ProForm
      onFinish={ioEmit}
      >
        <ProFormTextArea name="text">
        </ProFormTextArea>
      </ProForm>
    </>
  );
};
export default ChatPage;
