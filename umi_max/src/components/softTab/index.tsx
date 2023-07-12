import { SoftTabProps } from '@/global/define';
import React, { useState } from 'react';
import './index.less';
interface TabProps {
  id: string;
  label: string;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const Tab: React.FC<TabProps> = ({ id, label, isSelected, onClick }) => {
  const handleClick = () => {
    onClick(id);
  };

  const tabStyle = {
    borderBottom: isSelected ? '2px solid rgb(30, 111, 255)' : 'none',
    color: isSelected ? 'rgb(30, 111, 255)' : 'rgb(180, 180, 180)',
  };

  return (
    <div className="tab" style={tabStyle} onClick={handleClick}>
      {label}
    </div>
  );
};

const SoftTab: React.FC<SoftTabProps> = ({ tabs,OnClick }) => {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  const handleTabClick = (id: string) => {
    setSelectedTab(id);
    OnClick(id);
  };

  return (
    <div style={{width: '230px', height: '40px'}} className='flex-center'>
      {tabs ? (
        tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            isSelected={selectedTab === tab.id}
            onClick={handleTabClick}
          />
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default SoftTab;
