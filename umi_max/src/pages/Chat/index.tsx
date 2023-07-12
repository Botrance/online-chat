import { ProCard } from '@ant-design/pro-components';
import { connect } from '@umijs/max';
import { useEffect, useState } from 'react';

import { msgType, roomType } from '@/global/define';
import { InfoModelState, loadFromStorage } from '@/models/infoModel';
import { SocketModelState } from '@/models/socketModel';
import { Dispatch } from '@umijs/max';
import { Button, Form, Input } from 'antd';
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

interface MsgListProps {
  msgs: msgType[];
  username: string | null;
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
            className="room-card"
            key={room.roomId}
            style={{
              backgroundColor:
                room.roomId === selectedRoomId
                  ? 'rgb(235, 235, 235)'
                  : 'rgb(248, 249, 249)',
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

const MsgList: React.FC<MsgListProps> = React.memo(({ msgs, username }) => {
  return (
    <>
      {msgs ? (
        msgs.map((msg) => (
          <div
            key={msg.id}
            className={`msg-card ${
              msg.sender === username ? 'sent' : 'received'
            }`}
          >
            {msg.message}
          </div>
        ))
      ) : (
        <></>
      )}
    </>
  );
});

const ChatPage: React.FC<ChatPageProps> = ({
  dispatch,
  socketModel,
  infoModel,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [form] = Form.useForm(); //后面请修改为状态管理，因为要暂留text

  // 从 sessionStorage 中获取用户名和 ID
  const username = sessionStorage.getItem('username');
  const id = sessionStorage.getItem('id');

  const startTime = Date.now() - 24 * 60 * 60 * 1000; // 获取当前时间戳
  console.log('route chat render');

  const getRoomNameById = (roomId: string) => {
    const room = infoModel.rooms.find((room) => room.roomId === roomId);
    return room ? room.roomName : '';
  };

  const getMsgById = (roomId: string | null): msgType[] => {
    if (roomId) {
      const result = loadFromStorage<msgType[]>(`infoModel.msgs.${roomId}`);
      if (result) return result;
      else return [];
    } else return [];
  };

  const scrollToBottom = (containerClassName: string) => {
    const container = document.getElementsByClassName(containerClassName)[0];
    container.scrollTo(0, container.scrollHeight);
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
              endTime: Date.now(), // 传递的时间戳参数
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

  // 当选中房间时更新 selectedRoomId
  const handleRoomClick = (roomId: string) => {
    setSelectedRoomId(roomId);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const textValue = values.text;
      const socket = socketModel.socket;
      // 发送消息
      if (textValue && socket && selectedRoomId) {
        const data = {
          message: textValue,
          username: username,
          roomId: selectedRoomId,
          timestamp: Date.now(),
        };
        socket.emit('sendMessage', data);
        console.log(
          `message from ${username} to room: ${getRoomNameById(
            selectedRoomId,
          )}`,
          data,
        );
        form.resetFields();
      }
    });
    scrollToBottom('msg-container');
  };

  return (
    <div className="chat-page-card" style={{ width: '100%', height: '100%' }}>
      <ProCard split="vertical">
        <ProCard colSpan="20%" split="horizontal" direction="column">
          <ProCard style={{ height: '50px' }}></ProCard>
          <ProCard
            style={{ backgroundColor: 'rgb(248, 249, 249)', zIndex: '100' }}
            ghost
          >
            <RoomList
              rooms={infoModel.rooms}
              selectedRoomId={selectedRoomId}
              onRoomClick={handleRoomClick}
            />
          </ProCard>
        </ProCard>

        <ProCard
          className="chat-main-area"
          colSpan="80%"
          split="horizontal"
          direction="column"
        >
          <ProCard style={{ height: '50px' }} ghost>
            <div className="chat-title">
              {selectedRoomId ? getRoomNameById(selectedRoomId) : ''}
            </div>
          </ProCard>

          <ProCard ghost>
            <div style={{ height: '300px' }} className="msg-container">
              <MsgList username={username} msgs={getMsgById(selectedRoomId)} />
            </div>
          </ProCard>

          <ProCard
            className="chat-box"
            style={{ height: '220px', width: '100%' }}
            ghost
          >
            <Form form={form}>
              <Form.Item name="text">
                <Input.TextArea bordered={false} maxLength={5000} rows={4} />
              </Form.Item>
            </Form>
          </ProCard>

          <Button className="chat-btn" type="primary" onClick={handleSubmit}>
            发送
          </Button>
        </ProCard>
      </ProCard>
    </div>
  );
};

export default connect((state: any) => state)(ChatPage);
