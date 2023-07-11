import {
  AvatarIcon,
  ChatIcon,
  MenuIcon,
  MusicIcon,
  RelationIcon,
} from '@/components/icon';
import { resType } from '@/global/define';
import { InfoModelState } from '@/models/infoModel';
import { SocketModelState } from '@/models/socketModel';
import { ProCard } from '@ant-design/pro-components';
import { Dispatch, Outlet, connect, useLocation } from '@umijs/max';
import { useEffect } from 'react';
import './index.less';

type SiderItemType = {
  name: string;
  component: React.FunctionComponent<{ style?: React.CSSProperties }>;
};

interface HomePageProps {
  dispatch: Dispatch;
  socketModel: SocketModelState;
  infoModel: InfoModelState;
}

const SiderItems: SiderItemType[] = [
  { name: 'avatar', component: AvatarIcon },
  { name: 'chat', component: ChatIcon },
  { name: 'relation', component: RelationIcon },
  { name: 'music', component: MusicIcon },
  { name: 'menu', component: MenuIcon },
];

const Sider: React.FC = () => {
  const location = useLocation();

  const checkSelect = (name: string) => {
    if (location.pathname.includes(name)) return 'blue';
    return 'black';
  };

  return (
    <div
      style={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap' }}
    >
      {SiderItems.map((item) => {
        const Icon = item.component;
        return (
          <Icon
            key={item.name}
            style={{
              fontSize: '20px',
              marginTop: '20px',
              flexBasis: '100%',
              color: checkSelect(item.name),
            }}
          />
        );
      })}
    </div>
  );
};

const HomePage: React.FC<HomePageProps> = ({
  dispatch,
  infoModel,
  socketModel,
}) => {
  console.log('route home render');

  const username = sessionStorage.getItem('username');

  useEffect(() => {
    dispatch({
      type: 'infoModel/getFriends',
      payload: { username: username },
    });
    dispatch({
      type: 'infoModel/getRooms',
      payload: { username: username, roomType: 'all' },
    });
    return () => {
      dispatch({
        type: 'infoModel/clearStorage',
      });
    };
  }, [dispatch, username]);

  useEffect(() => {
    const socket = socketModel.socket;

    if (!socket) {
      dispatch({ type: 'socketModel/connect' });
    } else {
      socket.on('resMsg', (response: resType) => {
        console.log(response);
      });
    }

    return () => {
      const socket = socketModel.socket;
      if (socket) {
        socket.off('resMsg');
        dispatch({ type: 'socketModel/close' });
      }
    };
  }, [dispatch, socketModel.socket, username]);

  return (
    <div className="home-page-card">
      <ProCard split="vertical">
        <ProCard colSpan="5%" direction>
          <Sider />
        </ProCard>
        <ProCard ghost>
          <Outlet />
        </ProCard>
      </ProCard>
    </div>
  );
};
export default connect((state: any) => state)(HomePage);
