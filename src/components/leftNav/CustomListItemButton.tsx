import React from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIconProps,
  SxProps,
} from '@mui/material';
import theme from '../../theme';
import { useLocation, useNavigate } from 'react-router-dom';
import { Theme } from '@mui/material/styles';

const listIconStyle: SxProps<Theme> = {
  minWidth: '2.25rem',
};

type CustomListItemButtonProps = {
  pathname: string;
  menuText: string | undefined;
  includeAmount: boolean;
  includeIndent: boolean;
  Icon: React.ComponentType<SvgIconProps>;
  amount?: number;
};

const CustomListItemButton: React.FC<CustomListItemButtonProps> = ({
  pathname,
  menuText,
  includeAmount,
  amount,
  includeIndent,
  Icon,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ListItemButton
      onClick={(event) => {
        navigate(pathname);
      }}
      sx={{
        ...(includeIndent && {
          pl: 4,
        }),
        ...(location.pathname === pathname && {
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.main',
          },
        }),
      }}
    >
      <ListItemIcon sx={listIconStyle}>
        <span
          className={`${location.pathname === pathname ? 'text-bopblack' : 'text-bopgrey'}`}
        >
          <Icon />
        </span>
      </ListItemIcon>
      <ListItemText
        primary={menuText}
        sx={
          location.pathname === pathname
            ? {
                color: theme.palette.text.primary,
              }
            : {
                color: theme.palette.text.secondary,
              }
        }
      />
      {includeAmount && (
        <span className="font-bold rounded-full bg-bopblack flex items-center justify-center text-bopgreybkg w-8 text-sm">
          {amount}
        </span>
      )}
    </ListItemButton>
  );
};

export default CustomListItemButton;
