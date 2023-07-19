import { MsgList, RoomList } from '@/components/mapList';
import { SearchWithAdd } from '@/components/search/index';
import { msgType } from '@/global/define';
import { InfoModelState, loadFromStorage } from '@/models/infoModel';
import { SocketModelState } from '@/models/socketModel';
import { ProCard, ProForm } from '@ant-design/pro-components';
import { Dispatch, connect } from '@umijs/max';
import { Button, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
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
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [form] = Form.useForm(); //后面请修改为状态管理，因为要暂留text

  // 从 sessionStorage 中获取用户名和 ID
  const username = sessionStorage.getItem('username');
  const userId = sessionStorage.getItem('userId');

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
        userId: userId,
        roomId: selectedRoomId,
        timestamp: Date.now(),
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
          userId: userId,
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
          userId: userId,
          roomId: selectedRoomId,
          timestamp: Date.now(),
        };
        socket.emit('sendMessage', data);
        console.log(
          `message from ${userId} to room: ${getRoomNameById(
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
    <div className="chat-pageCard" style={{ width: '100%', height: '100%' }}>
      <ProCard split="vertical">
        <ProCard
          className="pageCard-sider"
          colSpan="25%"
          split="horizontal"
          direction="column"
        >
          <ProCard
            className="pageCard-sider-top"
            style={{ height: '100px' }}
            ghost
          >
            <SearchWithAdd />
          </ProCard>
          <ProCard
            className="pageCard-sider-bottom"
            style={{ backgroundColor: 'rgb(248, 249, 249)', zIndex: '100' }}
            ghost
          >
            <div style={{ overflowY: 'auto' }}>
              <RoomList
                rooms={infoModel.rooms}
                selectedRoomId={selectedRoomId}
                onRoomClick={handleRoomClick}
              />
            </div>
          </ProCard>
        </ProCard>

        <ProCard
          className="pageCard-main"
          colSpan="75%"
          split="horizontal"
          direction="column"
        >
          <ProCard
            className="pageCard-main-top"
            style={{ height: '50px' }}
            ghost
          >
            <div className="pageCard-title">
              {selectedRoomId ? getRoomNameById(selectedRoomId) : ''}
            </div>
          </ProCard>

          <ProCard className="pageCard-main-middle" ghost>
            <div style={{ height: '340px' }} className="msg-container">
              <MsgList username={username} msgs={getMsgById(selectedRoomId)} />
            </div>
          </ProCard>

          <ProCard
            className="pageCard-main-bottom"
            style={{ height: '220px', width: '100%' }}
            ghost
          >
            <Form form={form}>
              <Form.Item name="text">
                <Input.TextArea bordered={false} maxLength={5000} rows={4} />
              </Form.Item>
            </Form>
          </ProCard>

          <Button
            className="pageCard-btn"
            type="primary"
            onClick={handleSubmit}
          >
            发送
          </Button>
        </ProCard>
      </ProCard>
    </div>
  );
};

export default connect((state: any) => state)(ChatPage);
