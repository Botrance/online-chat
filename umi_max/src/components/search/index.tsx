import SoftTab from '@/components/softTab';
import { tabType } from '@/global/define';
import { InfoModelState } from '@/models/infoModel';
import {
  addFriend,
  createRoom,
  joinRoom,
  matchFriends,
  matchRooms,
} from '@/services/chat';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import { Dispatch, connect } from '@umijs/max';
import { Button, Form, Input, Modal, Space } from 'antd';
import { useRef, useState } from 'react';
import './index.less';

const userId = parseInt(sessionStorage.getItem('userId')!);
interface MixModalProps {
  modalOpen: string;
  setModalOpen: (type: string) => void;
  dispatch: Dispatch;
  infoModel: InfoModelState;
}

const tabs: tabType[] = [
  { id: '1', label: '找好友' },
  { id: '2', label: '找群' },
];
const MatchList: React.FC<{
  data: any;
  show: boolean;
}> = ({ data, show }) => {
  return (
    <div
      style={{
        backgroundColor: '#eee',
        margin: '-24px',
        padding: ' 24px',
        marginTop: '60px',
        display: show ? '' : 'none',
      }}
    >
      <ProList<any>
        ghost={true}
        itemCardProps={{
          ghost: true,
        }}
        showActions="hover"
        grid={{ gutter: 12, column: 3 }}
        metas={{
          content: {},
        }}
        dataSource={data}
      />
    </div>
  );
};

const PureMixModal: React.FC<MixModalProps> = ({
  modalOpen,
  setModalOpen,
  infoModel,
  dispatch,
}) => {
  const [selectedTabId, setSelectedTabId] = useState<string>('1');
  const [matchForm] = Form.useForm();
  const [createForm] = Form.useForm();

  const [dataUsers, setDataUsers] = useState<any[] | null>(null);
  const [dataRooms, setDataRooms] = useState<any[] | null>(null);
  const handleModalClose = () => {
    setModalOpen('null');
    setDataUsers(null);
    setDataRooms(null);
    matchForm.resetFields();
    createForm.resetFields();
  };

  const handleTabClick = (id: string) => {
    setSelectedTabId(id);
  };

  const handleSubmit = () => {
    matchForm
      .validateFields()
      .then(async (values) => {
        const { friend, room } = values;

        if (room) {
          try {
            const result = await matchRooms(room);
            setDataRooms(
              result!.user.map((item: any) => ({
                content: (
                  <div className="content-box-card">
                    <div className="square"></div>
                    <Space
                      direction="vertical"
                      size={2}
                      style={{ display: 'flex' }}
                    >
                      <span className="no-ellispe">id:{item.roomId}</span>
                      <span className="no-ellispe">{item.roomName}</span>
                      <Button
                        size="small"
                        style={{ fontSize: '12px' }}
                        onClick={() => {
                          joinRoom(userId, item.roomId).then((result) => {
                            if (result!.code === 100)
                              dispatch({
                                type: 'infoModel/getRooms',
                                payload: {
                                  roomId: item.roomId,
                                  timestamp: Date.now(),
                                },
                              });
                          });
                        }}
                      >
                        加入群聊
                      </Button>
                    </Space>
                  </div>
                ),
              })),
            );
          } catch (error) {
            console.error('Error matching rooms:', error);
            // 在这里处理匹配房间的错误情况
          }
        } else if (friend) {
          try {
            const result = await matchFriends(friend);
            setDataUsers(
              result!.user.map((item: any) => ({
                content: (
                  <div className="content-box-card">
                    <div className="square"></div>
                    <Space
                      direction="vertical"
                      size={1}
                      style={{
                        display: 'flex',
                        fontSize: '12px',
                        overflow: 'hidden',
                      }}
                    >
                      <span className="no-ellispe">id：{item.userId}</span>
                      <span className="no-ellispe">{item.userName}</span>
                      <Button
                        size="small"
                        style={{ fontSize: '12px', width: '60px' }}
                        onClick={() => {
                          addFriend(userId, item.userId).then((result) => {
                            if (result!.code === 100)
                              dispatch({
                                type: 'infoModel/getFriends',
                                payload: {
                                  userId,
                                  timestamp: Date.now(),
                                },
                              });
                          });
                        }}
                      >
                        加好友
                      </Button>
                    </Space>
                  </div>
                ),
              })),
            );
          } catch (error) {
            console.error('Error matching friends:', error);
            // 在这里处理匹配好友的错误情况
          }
        }

        // matchForm.resetFields();
      })
      .catch((error) => {
        console.error('Error validating fields:', error);
        // 在这里处理表单验证的错误情况
      });
  };

  const handleCreate = () => {
    createForm
      .validateFields()
      .then(async (values) => {
        const { roomName } = values;
        try {
          createRoom(userId, roomName).then((result) => {
            if (result!.code === 100)
              dispatch({
                type: 'infoModel/getRooms',
                payload: {
                  userId,
                  timestamp: Date.now(),
                },
              });
          });
        } catch (error) {
          console.error('Error create room:', error);
        }

        createForm.resetFields();
      })
      .catch((error) => {
        console.error('Error validating fields:', error);
        // 在这里处理表单验证的错误情况
      });
  };

  return (
    <>
      <Modal
        className="match-modal"
        open={modalOpen === 'match'}
        onCancel={handleModalClose}
        footer={null}
        maskClosable={false}
        destroyOnClose={true}
        style={{ display: 'absolute', top: '30%' }}
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
        <Form
          form={matchForm}
          style={{ position: 'relative', margin: '40px 0px' }}
        >
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
              top: 0,
            }}
            type="primary"
            onClick={handleSubmit}
          >
            查找
          </Button>
        </Form>

        {dataUsers && (
          <MatchList data={dataUsers} show={selectedTabId === '1'} />
        )}
        {dataRooms && (
          <MatchList data={dataRooms} show={selectedTabId === '2'} />
        )}
      </Modal>

      <Modal
        className="createRoom-modal"
        open={modalOpen === 'createRoom'}
        onCancel={handleModalClose}
        footer={null}
        maskClosable={false}
        destroyOnClose={true}
        style={{ display: 'absolute', top: '30%' }}
        width={600}
        title={'创建群聊'}
      >
        <Space
          direction="vertical"
          size={1}
          style={{
            display: 'flex',
            fontSize: '12px',
            overflow: 'hidden',
          }}
        >
          <Form form={createForm}>
            <Form.Item name="roomName">
              <Input></Input>
            </Form.Item>

            <Button onClick={handleCreate}>创建群聊</Button>
          </Form>
        </Space>
      </Modal>
    </>
  );
};

const MixModal = connect((state: any) => state)(PureMixModal);

export const SearchWithAdd: React.FC = () => {
  const [modalOpen, setModalOpen] = useState('null');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showModal = (type: 'match' | 'createRoom') => {
    setModalOpen(type);
    setIsAddMenuOpen(false);
  };

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
            <div className="add-menu-item" onClick={() => showModal('match')}>
              加好友/群
            </div>

            <div
              className="add-menu-item"
              onClick={() => showModal('createRoom')}
            >
              创建群聊
            </div>
          </div>
        )}
      </div>
      <MixModal modalOpen={modalOpen} setModalOpen={setModalOpen} />{' '}
    </div>
  );
};
