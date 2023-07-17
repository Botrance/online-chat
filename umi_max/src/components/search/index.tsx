import { AddMenuProps, ItemType } from '@/global/define';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import { useState } from 'react';
import './index.less';

const FriendLabel: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={showModal}>加好友/群</div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

const RoomLabel: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={showModal}>创建群聊</div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

const AddMenu: React.FC<AddMenuProps> = ({ items }) => {
  return (
    <div className="add-menu flex-center abs-box">
      {items ? (
        items.map((item) => (
          <div key={item!.key} className="add-menu-item">
            {item!.label}
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

const items: ItemType[] = [
  {
    key: '1',
    label: <FriendLabel />,
  },
  {
    key: '2',
    label: <RoomLabel />,
  },
];

export const SearchWithAdd: React.FC = () => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const handlePlusClick = () => {
    setIsAddMenuOpen(!isAddMenuOpen);
  };

  const handleMouseLeave = () => {
    setIsAddMenuOpen(false);
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
        {isAddMenuOpen && <AddMenu items={items} />}
      </div>
    </div>
  );
};
