import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import { useState } from 'react';
import './index.less';

export const SearchWithAdd: React.FC = () => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [friendModalOpen, setfriendModalOpen] = useState(false);
  const [roomModalOpen, setroomModalOpen] = useState(false);

  const handlePlusClick = () => {
    setIsAddMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsAddMenuOpen(false);
  };

  const showFriendModal = () => {
    setfriendModalOpen(true);
  };

  const showRoomModal = () => {
    setroomModalOpen(true);
  };

  const handleFriendModalClose = () => {
    setfriendModalOpen(false);
  };

  const handleRoomModalClose = () => {
    setroomModalOpen(false);
  };

  return (
    <div
      className="rela-box add-com"
      style={{ width: '230px', height: '40px', padding: '5px' }}
    >
      <Input
        style={{ width: '180px', height: '30px', fontSize: '14px' }}
        prefix={<SearchOutlined />}
        placeholder="搜索"
        allowClear
      />
      <div className="hover-area" onMouseLeave={handleMouseLeave}>
        <div className="icon-add flex-center abs-box" onClick={handlePlusClick}>
          <PlusOutlined className="add" />
        </div>
        {isAddMenuOpen && (
          <div className="add-menu flex-center abs-box">
            <div className="add-menu-item" onClick={showFriendModal}>
              加好友/群
            </div>

            <div className="add-menu-item" onClick={showRoomModal}>
              创建群聊
            </div>
          </div>
        )}
      </div>

      <Modal
        title="加好友/群"
        open={friendModalOpen}
        onOk={handleFriendModalClose}
        onCancel={handleFriendModalClose}
        maskClosable={false}
        centered
      >
        <p>FriendLabel 内容...</p>
      </Modal>

      <Modal
        title="创建群聊"
        open={roomModalOpen}
        onOk={handleRoomModalClose}
        onCancel={handleRoomModalClose}
        maskClosable={false}
        centered
      >
        <p>RoomLabel 内容...</p>
      </Modal>
    </div>
  );
};
