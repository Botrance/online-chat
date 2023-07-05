import { ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { connect } from '@umijs/max';
import { useEffect } from 'react';

import { InfoModelState } from '@/models/infoModel';
import { SocketModelState } from '@/models/socketModel';
import { Dispatch } from '@umijs/max';
import './index.less';

interface ChatPageProps {
  dispatch: Dispatch;
  socketModel: SocketModelState;
  infoModel: InfoModelState;
}

const ChatPage: React.FC<ChatPageProps> = ({
  dispatch,
  socketModel,
  infoModel,
}) => {
  // 从 sessionStorage 中获取用户名和 ID
  const username = sessionStorage.getItem('username');
  const id = sessionStorage.getItem('id');

  const mountTime = Date.now(); // 获取当前时间戳

  useEffect(() => {
    const socket = socketModel.socket;
    if (!socket) {
      dispatch({ type: 'socketModel/connect' });
    } else {
      dispatch({
        type: 'infoModel/getFriends',
        payload: { username: username },
      });
      dispatch({ type: 'infoModel/getRooms', payload: { username: username } });
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

    if (socket) {
      socket.on('message', (response: { updateMsg: string }) => {
        if (response && response.updateMsg) {
          dispatch({
            type: 'infoModel/getMsgs',
            payload: {
              timestamp: mountTime, // 传递的时间戳参数
              roomId: '8d7b820ff3fd4fc418ff806063bdcb53', // 传递的房间ID参数
            },
          });
        }
      });
      socket.emit('joinRoom', { username: username, roomId: '8d7b820ff3fd4fc418ff806063bdcb53', });
      socket.on(
        'resMsg',
        (response: { success: boolean; roomId?: string; message: string }) => {
          console.log(response);
        },
      );
    }

    return () => {
      const socket = socketModel.socket;
      if (socket) {
        socket.off('message');
      }
    };
  }, [dispatch, socketModel.socket]);

  const ioEmit = async (values: { text: string | undefined }) => {
    const socket = socketModel.socket;
    // 发送消息
    if (values.text && socket) {
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
