import { SoftTabProps } from '@/global/define';
import React, { useState } from 'react';
import './index.less';
interface TabProps {
  id: string;
  label: string;
  isSelected: boolean;
  style?:React.CSSProperties;
  onClick: (id: string) => void;
}

const Tab: React.FC<TabProps> = ({ id, label, isSelected, onClick, style }) => {
  const handleClick = () => {
    onClick(id);
  };

  const tabStyle = {
    borderBottom: isSelected ? '2px solid rgb(30, 111, 255)' : 'none',
    color: isSelected ? 'rgb(30, 111, 255)' : 'rgb(180, 180, 180)',
    ...style
  };

  return (
    <div className="tab" style={tabStyle} onClick={handleClick}>
      {label}
    </div>
  );
};

const SoftTab: React.FC<SoftTabProps> = ({
  tabs,
  OnClick,
  defaultTab,
  style,
  childStyle,
}) => {
  const [selectedTab, setSelectedTab] = useState<string | null>(defaultTab);

  const handleTabClick = (id: string) => {
    setSelectedTab(id);
    OnClick?.(id);
  };

  return (
    <div
      style={{ ...style }}
      className="flex-center softTab"
    >
      {tabs ? (
        tabs.map((tab) => (
          <Tab
            style={{...childStyle}}
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
