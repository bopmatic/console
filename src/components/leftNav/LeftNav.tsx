import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  FolderOpen as FolderOpenIcon,
  Domain as DomainIcon,
  Key as KeyIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Description as DescriptionIcon,
  Troubleshoot as TroubleshootIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import CustomListItemButton from './CustomListItemButton';
import { useProjects } from '../../hooks/useProjects';
import CircularProgress from '@mui/material/CircularProgress';
import { useEnvironments } from '../../hooks/useEnvironments';
import { useApiKeys } from '../../hooks/useApiKeys';

const drawerWidth = 240;

const DrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(open && {
      width: drawerWidth,
    }),
    ...(!open && {
      overflowX: 'hidden',
      width: theme.spacing(4),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(6),
      },
    }),
    backgroundColor: '#F5F6FA',
    boxShadow:
      'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
  },
}));

const LeftNav = () => {
  const [open, setOpen] = React.useState(true);
  const [projectsOpen, setProjectsOpen] = React.useState(true);
  const location = useLocation();
  const projects = useProjects();
  const environments = useEnvironments();
  const [apiKeys] = useApiKeys();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleClick = () => {
    setProjectsOpen(!projectsOpen);
  };

  const [isMobileView, setIsMobileView] = useState<boolean>(false); // Detect screen size

  const checkMobileOnNavigate = () => {
    if (isMobileView) {
      setOpen(false);
    }
  };

  useEffect(() => {
    // Media query for screen width below 768px (TailwindCSS's "md")
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const handleScreenResize = (event: MediaQueryListEvent) => {
      setIsMobileView(event.matches);
      if (event.matches) {
        setOpen(false); // Close the menu in mobile view
      }
    };

    // Initial check and add listener
    setIsMobileView(mediaQuery.matches);
    if (mediaQuery.matches) {
      setOpen(false);
    }

    mediaQuery.addEventListener('change', handleScreenResize);

    // Cleanup listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleScreenResize);
    };
  }, []);

  return (
    <DrawerStyled variant="permanent" open={open}>
      <div className="w-full shadow-inner">
        {open && (
          <div className="flex w-full justify-between pl-6 items-center">
            <span className="text-xs text-bopgreytext"></span>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
        )}
        {!open && (
          <div className="flex justify-center">
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </div>
        )}
      </div>
      {open && (
        <List
          sx={{
            paddingTop: '0',
          }}
        >
          <div className="flex items-center">
            <CustomListItemButton
              pathname="/projects"
              menuText="Projects"
              includeAmount={true}
              amount={projects?.length}
              includeIndent={false}
              Icon={FolderOpenIcon}
              onClickCallback={checkMobileOnNavigate}
            />
            <div
              className={`flex h-12 items-center ${location.pathname === '/projects' ? 'bg-boporange' : 'bg-bopgreybkg'}`}
            >
              {projectsOpen ? (
                <IconButton
                  onClick={handleClick}
                  sx={{
                    height: '2rem',
                    width: '2rem',
                  }}
                >
                  <span
                    className={`${location.pathname === '/projects' ? 'text-bopblack' : 'text-bopgrey'}`}
                  >
                    <ExpandLessIcon />
                  </span>
                </IconButton>
              ) : (
                <IconButton
                  onClick={handleClick}
                  sx={{
                    height: '2rem',
                    width: '2rem',
                  }}
                >
                  <span
                    className={`${location.pathname === '/projects' ? 'text-bopblack' : 'text-bopgrey'}`}
                  >
                    <ExpandMoreIcon />
                  </span>
                </IconButton>
              )}
            </div>
          </div>
          <Collapse in={projectsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {projects ? (
                projects?.map((projectDesc, index) => {
                  return (
                    <CustomListItemButton
                      pathname={`/projects/${projectDesc.id}`}
                      menuText={projectDesc.header?.name}
                      includeAmount={false}
                      includeIndent={true}
                      Icon={DescriptionIcon}
                      key={index}
                      comparePathWithStartsWith={true}
                      onClickCallback={checkMobileOnNavigate}
                    />
                  );
                })
              ) : (
                <ListItemButton sx={{ pl: 8 }}>
                  <ListItemIcon>
                    <div className="flex justify-center">
                      <CircularProgress color="primary" size="2rem" />
                    </div>
                  </ListItemIcon>
                </ListItemButton>
              )}
            </List>
          </Collapse>
          <CustomListItemButton
            pathname="/environments"
            menuText="Environments"
            includeAmount={true}
            amount={environments?.length}
            includeIndent={false}
            Icon={DomainIcon}
            onClickCallback={checkMobileOnNavigate}
          />
          <CustomListItemButton
            pathname="/api-keys"
            menuText="API Keys"
            includeAmount={true}
            amount={apiKeys?.length}
            includeIndent={false}
            Icon={KeyIcon}
            onClickCallback={checkMobileOnNavigate}
          />
          <CustomListItemButton
            pathname="/logs"
            menuText="Logs"
            includeAmount={false}
            includeIndent={false}
            Icon={TroubleshootIcon}
            onClickCallback={checkMobileOnNavigate}
          />
          <CustomListItemButton
            pathname="/metrics"
            menuText="Metrics"
            includeAmount={false}
            includeIndent={false}
            Icon={InsightsIcon}
            onClickCallback={checkMobileOnNavigate}
          />
        </List>
      )}
    </DrawerStyled>
  );
};

export default LeftNav;
