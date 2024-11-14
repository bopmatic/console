import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../utils/authUtils';
import { useAtom } from 'jotai/index';
import { usernameWithPersistenceAtom } from '../../atoms';

const UsernameMenu: React.FC = () => {
  const [username] = useAtom(usernameWithPersistenceAtom);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };
  const handleChangePassword = () => {
    navigate('/change-password');
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="text-bopgreytext flex items-center pr-6">
      <Button
        id="username-dropdown-customized-button"
        aria-controls={open ? 'username-dropdown-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="text"
        disableElevation
        onClick={handleClick}
        sx={{
          color: '#5A607F',
          //paddingRight: '1rem',
          fontSize: '1rem',
          '& .MuiSvgIcon-root': {
            fontSize: '1.25rem', // Ensure the end icon matches this size
          },
        }}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <span className="text-bopgrey pr-1">
          <PersonIcon />
        </span>
        {username}
      </Button>
      <Menu
        id="username-dropdown-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'username-dropdown-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleSignOut} disableRipple>
          Sign out
        </MenuItem>
        <MenuItem onClick={handleChangePassword} disableRipple>
          Change password
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UsernameMenu;
