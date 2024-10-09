import React from 'react';
import { useLocation } from 'react-router-dom';
import BopmaticLink from '../link/BopmaticLink';
import { Breadcrumbs, Typography } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

const BopmaticBreadcrumbs: React.FC = () => {
  const location = useLocation();

  // Split the pathname into an array of path segments
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
    >
      {pathnames.map((value, index) => {
        // Build the path for the current breadcrumb item
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        // Check if it's the last breadcrumb (active page)
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography color="text.primary" key={to}>
            {value}
          </Typography>
        ) : (
          <BopmaticLink to={to} key={to}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </BopmaticLink>
        );
      })}
    </Breadcrumbs>
  );
};

export default BopmaticBreadcrumbs;
