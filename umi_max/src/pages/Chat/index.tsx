import { ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { connect } from '@umijs/max';
import { useEffect, useState } from 'react';

import './index.less';

const ChatPage: React.FC = ({ dispatch, socketModel, infoModel }: any) => {
  // 绑定监听, 接收服务器发送的消息
  const username = sessionStorage.getItem('username');
  const id = sessionStorage.getItem('id');

  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket = socketModel.socket;
    if (!socket) {
      dispatch({ type: 'socketModel/connect' });
    } else {
      dispatch({ type: 'infoModel/getFriends' });
      dispatch({ type: 'infoModel/getRooms' });
    }

    return () => {
      const socket = socketModel.socket;
      if (socket) {
        dispatch({ type: 'socketModel/close' });
      }
    };
  }, [dispatch, socketModel.socket]);

  useEffect(() => {
    const socket = socketModel.socket;

    const preSetMessage = (newMessage: string) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      console.log(newMessage);
    };

    if (socket) {
      socket.on('message', preSetMessage);
      socket.emit('joinRoom', { username: username, othername: 'Botrance' });
      socket.on(
        'resMsg',
        (response: { success: any; roomId?: any; message: any }) => {
          console.log(response);
        },
      );
    }

    return () => {
      const socket = socketModel.socket;
      if (socket) {
        socket.off('message', preSetMessage);
      }
    };
  }, [dispatch, socketModel.socket]);

  const ioEmit = async (values: { text: string | undefined }) => {
    const socket = socketModel.socket;
    // 发送消息
    if (values.text) {
      const data = {
        message: values.text,
        username: username,
        roomId: '8d7b820ff3fd4fc418ff806063bdcb53',
      };
      socket.emit('sendMessage', data);
      console.log(`message from ${username} to ${'Botrance'}`, data);
    }
  };

  return (
    <>
      <ProForm onFinish={ioEmit}>
        <div id="chat-box" className="chat-box">
          <ProFormTextArea name="text"></ProFormTextArea>
        </div>
      </ProForm>
    </>
  );
};

export default connect((state: any) => state)(ChatPage);
