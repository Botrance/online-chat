import avatar from '@/assets/avatar.svg';
import {
  CustomerServiceOutlined,
  MenuOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Avatar } from 'antd';

export const AvatarIcon: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => {
  return <img src={avatar} alt="SVG Image" style={{ marginBottom: '10px' }} />;
  return <Avatar icon={<UserOutlined />} />
};

export const ChatIcon: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => {
  const navigate = useNavigate();
  return (
    <MessageOutlined
      onClick={() => {
        navigate('/chat');
      }}
      style={{ ...style }}
    />
  );
};

export const RelationIcon: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => {
  const navigate = useNavigate();
  return (
    <UserOutlined
      onClick={() => {
        navigate('/relation');
      }}
      style={{ ...style }}
    />
  );
};

export const MusicIcon: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => {
  return <CustomerServiceOutlined style={{ ...style }} />;
};

export const MenuIcon: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => {
  return (
    <MenuOutlined
      style={{
        ...style,
        position: 'absolute',
        left: 'calc(100% - 20px)/2',
        bottom: '7.5%',
      }}
    />
  );
};
