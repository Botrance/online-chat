import { ProCard, ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { connect } from '@umijs/max';
import { useEffect, useState } from 'react';

import { roomType } from '@/global/define';
import { InfoModelState } from '@/models/infoModel';
import { SocketModelState } from '@/models/socketModel';
import { Dispatch } from '@umijs/max';
import React from 'react';
import './index.less';

interface ChatPageProps {
  dispatch: Dispatch;
  socketModel: SocketModelState;
  infoModel: InfoModelState;
}

interface RoomListProps {
  rooms: roomType[];
  selectedRoomId: string | null;
  onRoomClick: (roomId: string) => void;
}

const RoomList: React.FC<RoomListProps> = React.memo(
  ({ rooms, selectedRoomId, onRoomClick }) => {
    useEffect(() => {
      if (!selectedRoomId && rooms.length > 0) {
        onRoomClick(rooms[0].roomId);
      }
    }, [selectedRoomId, rooms, onRoomClick]);

    return (
      <>
        {rooms.map((room) => (
          <div
            key={room.roomId}
            style={{
              backgroundColor:
                room.roomId === selectedRoomId ? 'grey' : 'white',
            }}
            onClick={() => onRoomClick(room.roomId)}
          >
            {room.roomName}
          </div>
        ))}
      </>
    );
  },
);

const ChatPage: React.FC<ChatPageProps> = ({
  dispatch,
  socketModel,
  infoModel,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  // 从 sessionStorage 中获取用户名和 ID
  const username = sessionStorage.getItem('username');
  const id = sessionStorage.getItem('id');

  const startTime = Date.now(); // 获取当前时间戳
  console.log('route chat render');

  // 当选中房间时更新 selectedRoomId
  const handleRoomClick = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  const getRoomNameById = (roomId: string) => {
    const room = infoModel.rooms.find((room) => room.roomId === roomId);
    return room ? room.roomName : '';
  };

  useEffect(() => {
    const socket = socketModel.socket;

    if (socket && selectedRoomId) {
      dispatch({
        type: 'infoModel/getMsgs',
        payload: {
          startTime: startTime, // 传递的时间戳参数
          roomId: selectedRoomId, // 传递的房间ID参数
        },
      });
    }
  }, [dispatch, socketModel.socket, selectedRoomId]);

  useEffect(() => {
    const socket = socketModel.socket;
    const endTime = Date.now();
    if (socket && selectedRoomId) {
      socket.emit('joinRoom', {
        username: username,
        roomId: selectedRoomId,
      });

      socket.on('message', (response: { updateMsg: string }) => {
        if (response && response.updateMsg) {
          dispatch({
            type: 'infoModel/getMsgs',
            payload: {
              startTime: startTime,
              endTime: endTime, // 传递的时间戳参数
              roomId: selectedRoomId, // 传递的房间ID参数
            },
          });
        }
      });
    }

    return () => {
      const socket = socketModel.socket;
      if (socket) {
        socket.emit('leaveRoom', {
          username: username,
          roomId: selectedRoomId,
        });
        socket.off('message');
      }
    };
  }, [dispatch, socketModel.socket, selectedRoomId]);

  const ioEmit = async (values: { text: string | undefined }) => {
    const socket = socketModel.socket;
    // 发送消息
    if (values.text && socket && selectedRoomId) {
      const data = {
        message: values.text,
        username: username,
        roomId: selectedRoomId,
      };
      socket.emit('sendMessage', data);
      console.log(
        `message from ${username} to room: ${getRoomNameById(selectedRoomId)}`,
        data,
      );
    }
  };

  return (
    <div className="chat-page-card" style={{ width: '100%', height: '100%' }}>
      <ProCard split="vertical">
        <ProCard colSpan="20%" split="horizontal" direction="column">
          <ProCard style={{ height: '50px' }}></ProCard>
          <ProCard>
            <RoomList
              rooms={infoModel.rooms}
              selectedRoomId={selectedRoomId}
              onRoomClick={handleRoomClick}
            />
          </ProCard>
        </ProCard>

        <ProCard colSpan="80%" split="horizontal" direction="column">
          <ProCard style={{ height: '50px' }}></ProCard>
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
