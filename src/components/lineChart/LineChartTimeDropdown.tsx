import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { OpenInNew } from '@mui/icons-material';
import { Dispatch, SetStateAction } from 'react';
import {
  getTimeTextFromEnum,
  getTimeTypeFromElementText,
  TIME_TYPE,
} from './utils';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}));

type LineChartTimeDropdownProps = {
  currTime: TIME_TYPE;
  setCurrTime: Dispatch<SetStateAction<TIME_TYPE>>;
};

const LineChartTimeDropdown: React.FC<LineChartTimeDropdownProps> = ({
  currTime,
  setCurrTime,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    setCurrTime(getTimeTypeFromElementText(target.innerText));
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="line-chart-time-dropdown-button"
        aria-controls={open ? 'line-chart-time-dropdown-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="outlined"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          borderColor: '#A1A7C4', // bopmatic-grey
          color: '#5A607F', // bopmatic-grey-text
          '&:hover': {
            borderColor: '#A1A7C4', // bopmatic-grey
          },
        }}
      >
        {getTimeTextFromEnum(currTime)}
      </Button>
      <StyledMenu
        id="line-chart-time-dropdown-menu"
        MenuListProps={{
          'aria-labelledby': 'line-chart-time-dropdown-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
          Last 24 hours
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          Last 48 hours
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          Last 7 days
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          Last 30 days
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          Custom time&nbsp;
          <OpenInNew />
        </MenuItem>
      </StyledMenu>
    </div>
  );
};

export default LineChartTimeDropdown;
