import React, { useCallback } from 'react';
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
  comparePathWithStartsWith?: boolean;
};

const CustomListItemButton: React.FC<CustomListItemButtonProps> = ({
  pathname,
  menuText,
  includeAmount,
  amount,
  includeIndent,
  Icon,
  comparePathWithStartsWith,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  // By default, we just compare that current URL/pathname matches the pathname we expect from "pathname" property of this component.
  // However, for sub-resources under the project, i.e. service details, we want to still highlight the project in the leftnav when viewing
  // the sub components in the console.
  const isPathnameMatchingLocation = useCallback(() => {
    if (comparePathWithStartsWith) {
      return location.pathname.startsWith(pathname);
    }
    return location.pathname === pathname;
  }, [comparePathWithStartsWith, location.pathname, pathname]);

  return (
    <ListItemButton
      onClick={(event) => {
        navigate(pathname);
      }}
      sx={{
        ...(includeIndent && {
          pl: 4,
        }),
        ...(isPathnameMatchingLocation() && {
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.main',
          },
        }),
      }}
    >
      <ListItemIcon sx={listIconStyle}>
        <span
          className={`${isPathnameMatchingLocation() ? 'text-bopblack' : 'text-bopgrey'}`}
        >
          <Icon />
        </span>
      </ListItemIcon>
      <ListItemText
        primary={menuText}
        sx={
          isPathnameMatchingLocation()
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
