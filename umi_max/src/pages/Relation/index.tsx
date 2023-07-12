import { RoomList } from '@/components/mapList';
import { SearchWithAdd } from '@/components/search';
import SoftTab from '@/components/softTab';
import { roomType, tabType } from '@/global/define';
import { InfoModelState } from '@/models/infoModel';
import { ProCard } from '@ant-design/pro-components';
import { Dispatch, connect } from '@umijs/max';
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

const RelationPage: React.FC<RelationPageProps> = ({ dispatch, infoModel }) => {
  console.log('route realtion render');

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);

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
              <SoftTab tabs={tabs} OnClick={handleTabClick} />
            </div>
          </ProCard>

          <ProCard
            className="pageCard-sider-bottom"
            style={{ backgroundColor: 'rgb(248, 249, 249)', zIndex: '100' }}
            ghost
          >
            {selectedTabId === '2' && (
              <RoomList
                rooms={infoModel.rooms.filter((value: roomType) => {
                  return value.roomType === 'public';
                })}
                selectedRoomId={selectedRoomId}
                onRoomClick={handleRoomClick}
              />
            )}
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
