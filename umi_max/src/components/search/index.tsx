import SoftTab from '@/components/softTab';
import { tabType } from '@/global/define';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import { useRef, useState } from 'react';
import './index.less';
import { matchFriends, matchRooms } from '@/services/chat';

const tabs: tabType[] = [
  { id: '1', label: '找好友' },
  { id: '2', label: '找群' },
];

export const SearchWithAdd: React.FC = () => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState('null');
  const [selectedTabId, setSelectedTabId] = useState<string>('1');
  const [form] = Form.useForm();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlusClick = () => {
    setIsAddMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsAddMenuOpen(false);
    }, 500);
  };

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const showModal = (type: 'friend' | 'room') => {
    setModalOpen(type);
    setIsAddMenuOpen(false);
  };

  const handleModalClose = () => {
    setModalOpen('null');
  };

  const handleTabClick = (id: string) => {
    setSelectedTabId(id);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const {friend,room} = values;
      
      if(room){
        matchRooms(room);
      }else if(friend){
        matchFriends(friend);
      }

      form.resetFields();
     
    });
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

      <div
        className="hover-area"
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <div className="icon-add flex-center abs-box" onClick={handlePlusClick}>
          <PlusOutlined className="add" />
        </div>
        {isAddMenuOpen && (
          <div className="add-menu flex-center abs-box">
            <div className="add-menu-item" onClick={() => showModal('friend')}>
              加好友/群
            </div>

            <div className="add-menu-item" onClick={() => showModal('room')}>
              创建群聊
            </div>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen === 'friend'}
        onCancel={handleModalClose}
        footer={null}
        maskClosable={false}
        destroyOnClose={true}
        centered
        width={600}
      >
        <SoftTab
          tabs={tabs}
          defaultTab={'1'}
          OnClick={handleTabClick}
          style={{
            height: '60px',
            margin: 'auto',
            width: '50%',
            marginTop: '-20px',
          }}
          childStyle={{ width: '60px', fontSize: '16px' }}
        />
        <Form form={form} style={{position:"relative"}}>
          <Form.Item
            style={{
              display: selectedTabId === '1' ? '' : 'none',
            }}
            name="friend"
          >
            <Input
              style={{
                width: '450px',
                height: '30px',
                fontSize: '14px',
              }}
              prefix={<SearchOutlined />}
              placeholder="请输入用户id或昵称"
              allowClear
            />
          </Form.Item>

          <Form.Item
            style={{
              display: selectedTabId === '2' ? '' : 'none',
            }}
            name="room"
          >
            <Input
              style={{
                width: '450px',
                height: '30px',
                fontSize: '14px',
              }}
              prefix={<SearchOutlined />}
              placeholder="请输入群号码/群名称"
              allowClear
            />
          </Form.Item>

          <Button
            style={{
              position: 'absolute',
              right: '10px',
              width: '70px',
            }}
            type="primary"
            onClick={handleSubmit}
          >
            查找
          </Button>
        </Form>
      </Modal>

      <Modal
        open={modalOpen === 'room'}
        onCancel={handleModalClose}
        footer={null}
        maskClosable={false}
        destroyOnClose={true}
        centered
        width={600}
      >
        <p>RoomLabel 内容...</p>
      </Modal>
    </div>
  );
};
