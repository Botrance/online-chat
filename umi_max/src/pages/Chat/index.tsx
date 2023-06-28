import { ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { connect } from '@umijs/max';
import { useEffect, useState } from 'react';
import styles from './index.less';

const ChatPage: React.FC = ({ dispatch, authModel, socketModel }: any) => {
  // 绑定监听, 接收服务器发送的消息
  const socket = socketModel.socket;
  const username = sessionStorage.getItem('username');
  const id = sessionStorage.getItem('id');

  const [users, setUsers] = useState<string[]>([]);

  // const a = socket.emit('roomConnect', {
  //   username: username,
  //   time: Date.now(),
  // });
  if (socket) {
    socket.on('users', function (data: any) {
      console.log('客户端接收服务器发送的消息', data);
      data?.forEach((x: string) => {
        users.push(x);
      });
      console.log(users);
    });

    socket.on('resCode', function (data: any) {
      console.log('客户端接收服务器发送的消息', data);
    });

    socket.on('receiveMsg', function (data: any) {
      console.log('客户端接收服务器发送的消息', data);
    });
  }

  useEffect(() => {
    // componentDidMount
    let chatbox: HTMLElement = document.getElementById(
      'chat-box',
    ) as HTMLElement;
    let textarea: HTMLTextAreaElement = chatbox.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    textarea.style.resize = 'none';

    return () => {
      if (socket) {
        // componentWillUnmount
        socket.off('resCode');
        socket.off('receiveMsg');
        socket.off('users');
      }
    };
  });

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
