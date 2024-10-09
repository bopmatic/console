import React from 'react';

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const BopmaticTabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div className="pt-4">{children}</div>}
    </div>
  );
};

export default BopmaticTabPanel;
