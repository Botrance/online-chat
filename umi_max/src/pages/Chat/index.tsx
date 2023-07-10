import { ProCard, ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { connect } from '@umijs/max';
import { useEffect } from 'react';

import { InfoModelState } from '@/models/infoModel';
import { SocketModelState } from '@/models/socketModel';
import { Dispatch } from '@umijs/max';
import './index.less';
import { roomType } from '@/global/define';

interface ChatPageProps {
  dispatch: Dispatch;
  socketModel: SocketModelState;
  infoModel: InfoModelState;
}

interface RoomListProps {
  rooms: roomType[]; // 这里的类型根据你的实际数据结构进行修改
}

const RoomList: React.FC<RoomListProps> = ({ rooms }) => {
  // 使用 map 方法渲染房间列表
  return (
    <>
      {rooms.map((room) => (
        <div key={room.roomId}>{room.roomName}</div>
      ))}
    </>
  );
};

const ChatPage: React.FC<ChatPageProps> = ({
  dispatch,
  socketModel,
  infoModel,
}) => {
  // 从 sessionStorage 中获取用户名和 ID
  const username = sessionStorage.getItem('username');
  const id = sessionStorage.getItem('id');

  const mountTime = Date.now(); // 获取当前时间戳

  console.log('route chat render');

  useEffect(() => {
    const socket = socketModel.socket;
    if (!socket) {
      dispatch({ type: 'socketModel/connect' });
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
      socket.emit('joinRoom', {
        username: username,
        roomId: '8d7b820ff3fd4fc418ff806063bdcb53',
      });
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
    <div className='chat-page-card' style={{ width: '100%', height: '100%' }}>
      <ProCard  split="vertical">
        <ProCard colSpan="20%" split="horizontal" direction="column">
          <ProCard style={{height:"50px"}}></ProCard>
          <ProCard><RoomList rooms={infoModel.rooms} /> {/* 将 infoModel.rooms 映射为 RoomList 组件的 props */}</ProCard>
        </ProCard>

        <ProCard colSpan="80%" split="horizontal" direction="column">
          <ProCard style={{height:"50px"}}></ProCard>
          <ProCard>
            <ProForm onFinish={ioEmit}>
              <div id="chat-box" className="chat-box">
                <ProFormTextArea name="text"></ProFormTextArea>
              </div>
            </ProForm>
          </ProCard>
        </ProCard>
      </ProCard>
    </div>
  );
};

export default connect((state: any) => state)(ChatPage);
