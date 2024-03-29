import { FriendList, RoomList } from '@/components/mapList';
import { SearchWithAdd } from '@/components/search';
import SoftTab from '@/components/softTab';
import { roomType, tabType } from '@/global/define';
import { InfoModelState } from '@/models/infoModel';
import { createRoom } from '@/services/chat';
import { ProCard } from '@ant-design/pro-components';
import { Dispatch, connect, history } from '@umijs/max';
import { useState } from 'react';
import './index.less';

interface RelationPageProps {
  dispatch: Dispatch;
  infoModel: InfoModelState;
}

const tabs: tabType[] = [
  { id: '1', label: '朋友' },
  { id: '2', label: '群聊' },
];
const userId = parseInt(sessionStorage.getItem('userId')!);

const RelationPage: React.FC<RelationPageProps> = ({ dispatch, infoModel }) => {
  console.log('route realtion render');

  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);

  const handleFriendClick = (minorId: string) => {
    setSelectedFriendId(minorId);
  };

  const handleFriendDbClick = (minorId: string) => {
    createRoom(userId, undefined, 'private').then((result) => {
      if (result!.code === 100) history.push('/chat');
      dispatch({
        type: 'infoModel/getRooms',
        payload: {
          userId,
          timestamp: Date.now(),
        },
      });
    });
  };

  const handleRoomClick = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  const handleTabClick = (id: string) => {
    setSelectedTabId(id);
  };

  return (
    <div
      className="relation-pageCard"
      style={{ width: '100%', height: '100%' }}
    >
      <ProCard split="vertical">
        <ProCard
          className="pageCard-sider"
          colSpan="25%"
          split="horizontal"
          direction="column"
        >
          <ProCard
            className="pageCard-sider-top rela-box"
            style={{ height: '100px' }}
            ghost
          >
            <SearchWithAdd />
            <div
              style={{
                width: '100%',
                height: '40px',
                position: 'absolute',
                bottom: '-5px',
                flexWrap: 'nowrap',
              }}
              className="flex-center"
            >
              <SoftTab tabs={tabs} defaultTab={'1'} OnClick={handleTabClick} />
            </div>
          </ProCard>

          <ProCard
            className="pageCard-sider-bottom"
            style={{ backgroundColor: 'rgb(248, 249, 249)', zIndex: '100' }}
            ghost
          >
            <div
              style={{
                overflowY: 'auto',
                display: selectedTabId === '1' ? '' : 'none',
              }}
            >
              <FriendList
                friends={infoModel.friends}
                selectedFriendId={selectedFriendId}
                onFriendClick={handleFriendClick}
                OnFriendDbClick={handleFriendDbClick}
              />
            </div>
            <div
              style={{
                overflowY: 'auto',
                display: selectedTabId === '2' ? '' : 'none',
              }}
            >
              <RoomList
                rooms={infoModel.rooms.filter((value: roomType) => {
                  return value.roomType === 'public';
                })}
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
        ></ProCard>
      </ProCard>
    </div>
  );
};

export default connect((state: any) => state)(RelationPage);
