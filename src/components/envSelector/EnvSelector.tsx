import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

/**
 * Selector for Environment
 *
 * TODO: Once customers are able to create additional environments this should update to change the current environment of the view
 * @constructor
 */
const EnvSelector: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="env-dropdown-customized-button"
        aria-controls={open ? 'env-dropdown-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="text"
        disableElevation
        onClick={handleClick}
        sx={{
          color: 'black',
          fontSize: '1.5rem',
          fontWeight: '700',
          '& .MuiSvgIcon-root': {
            fontSize: '2rem', // Ensure the end icon matches this size
          },
        }}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Production
      </Button>
      <Menu
        id="env-dropdown-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'env-dropdown-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
          Production
        </MenuItem>
      </Menu>
    </div>
  );
};

export default EnvSelector;
