import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const UsernameMenu = () => {
  return (
    <div className="text-bopgreytext flex items-center pr-6">
      <div className="text-sm">carensdorf@cloudscionconsulting.com</div>
      <span className="text-bopgreytext">
        <KeyboardArrowDownIcon style={{ fontSize: 24 }} />
      </span>
    </div>
  );
};

export default UsernameMenu;
