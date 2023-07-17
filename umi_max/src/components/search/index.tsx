import { AddMenuProps, ItemType } from '@/global/define';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import './index.less';
import { useState } from 'react';

const items: ItemType[] = [
  {
    key: '1',
    label: <>加好友/群</>,
  },
  {
    key: '2',
    label: <>创建群聊</>,
  },
];

const AddMenu: React.FC<AddMenuProps> = ({ items }) => {
  return (
    <div className="add-menu flex-center abs-box">
      {items ? (
        items.map((item) => (
          <div
            key={item!.key}
            className="add-menu-item"
            onClick={item!.onClick}
          >
            {item!.label}
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

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
