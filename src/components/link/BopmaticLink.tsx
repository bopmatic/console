import React from 'react';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // If using react-router-dom for routing

// Define the props for your custom link
interface BopmaticLinkProps extends MuiLinkProps {
  to: string; // Define a 'to' prop for navigation
  logClick?: boolean; // Optional prop to log clicks
}

/**
 * Mostly used to customize the color because our primary orange can't be used for text
 * @param to
 * @param logClick
 * @param children
 * @param props
 * @constructor
 */
const BopmaticLink: React.FC<BopmaticLinkProps> = ({
  to,
  logClick = false,
  children,
  ...props
}) => {
  const handleClick = () => {
    if (logClick) {
      console.log(`Link clicked: ${to}`);
    }
  };

  return (
    <MuiLink
      component={RouterLink} // Use react-router Link for routing, replace this with 'a' if not using routing
      to={to}
      onClick={handleClick}
      sx={{
        color: '#A06603',
        fontWeight: 'bold',
      }}
      underline="always"
      {...props} // Spread any additional props
    >
      {children}
    </MuiLink>
  );
};

export default BopmaticLink;
