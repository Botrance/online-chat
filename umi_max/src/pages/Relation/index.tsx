import { SearchWithAdd } from '@/components/search';
import SoftTab from '@/components/softTab';
import { tabType } from '@/global/define';
import { ProCard } from '@ant-design/pro-components';
import './index.less';

const tabs: tabType[] = [
  { id: '1', label: '朋友' },
  { id: '2', label: '群聊' },
];

const RelationPage: React.FC = () => {
  console.log('route realtion render');

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
              <SoftTab tabs={tabs} />
            </div>
          </ProCard>

          <ProCard
            className="pageCard-sider-bottom"
            style={{ backgroundColor: 'rgb(248, 249, 249)', zIndex: '100' }}
            ghost
          >
            {/* <RoomList
          rooms={infoModel.rooms}
          selectedRoomId={selectedRoomId}
          onRoomClick={handleRoomClick}
        /> */}
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

export default RelationPage;
