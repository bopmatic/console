import React from 'react';
import BopmaticLogo from '../../assets/images/bopmaticLogo.png';
import UsernameMenu from '../usernameMenu/UsernameMenu';

export type HeaderProps = {
  hideUser?: boolean;
};

const Header: React.FC<HeaderProps> = ({ hideUser }) => {
  return (
    <div className="header flex h-16 justify-between shadow-md">
      <img src={BopmaticLogo} alt="Bopmatic Logo" className="p-1" />
      {!hideUser && <UsernameMenu />}
    </div>
  );
};

export default Header;
