import { ws_proxy } from '@/global/config';
import { ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { connect } from '@umijs/max';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import styles from './index.less';

const ChatPage: React.FC = ({ dispatch, authModel }: any) => {
  // 绑定监听, 接收服务器发送的消息
  const socket = io(ws_proxy);
  const username = sessionStorage.getItem('username');
  const id = sessionStorage.getItem('id');

  socket.emit('roomConnect', { roomId: '1' });

  useEffect(() => {
    // componentDidMount
    socket.on('resCode', function (data) {
      console.log('客户端接收服务器发送的消息', data);
    });

    socket.on('receiveMsg', function (data) {
      console.log('客户端接收服务器发送的消息', data);
    });

    let chatbox: HTMLElement = document.getElementById(
      'chat-box',
    ) as HTMLElement;
    let textarea: HTMLTextAreaElement = chatbox.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    textarea.style.resize = 'none';
    return () => {
      // componentWillUnmount
      socket.off('resCode', function (data) {
        console.log('关闭socket链接:resCode', data);
      });

      socket.off('receiveMsg', function (data) {
        console.log('关闭socket链接:receiveMsg', data);
      });
    };
  }, [socket]);

  const ioEmit = async (values: { text: string | undefined }) => {
    // 发送消息
    if (values.text) {
      const data = {
        id: id,
        message: values.text,
        user_sender: username,
        user_receiver: 'Botrance',
        time: Date.now(),
      };
      socket.emit('sendMsg', data);
      console.log('客户端向服务器发消息', data);
    }
  };

  return (
    <>
      <ProForm onFinish={ioEmit}>
        <div id="chat-box" className={styles['chat-box']}>
          <ProFormTextArea name="text"></ProFormTextArea>
        </div>
      </ProForm>
    </>
  );
};
export default connect((state: any) => state)(ChatPage);
