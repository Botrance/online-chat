import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

export const SearchWithAdd: React.FC = () => {
  return (
    <div
      className="rela-box"
      style={{ width: '230px', height: '40px', padding: '5px' }}
    >
      <Input
        style={{ width: '180px', height: '30px', fontSize: '14px' }}
        prefix={<SearchOutlined />}
        placeholder="搜索"
        allowClear
      />
      <PlusOutlined
        style={{
          position: 'absolute',
          right: '18px',
          top: '13px',
        }}
      />
    </div>
  );
};
