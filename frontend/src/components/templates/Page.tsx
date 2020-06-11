import React from 'react';
import { AppBar, Drawer, Toolbar, Typography, IconButton, MenuItem, Menu, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Menu as MenuIcon, AccountCircle, Home as HomeIcon, Person as PersonIcon } from '@material-ui/icons';
import styles from './Page.scss';
import { Link } from 'react-router-dom';

interface PageProps {
  children: JSX.Element;
}

export default function PageTemplate(props: PageProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  
  const isLoggedIn = sessionStorage.getItem('username') !== null;
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const userMenu = (<>
    <MenuItem><Link to="/me" className={styles.menuItem}>마이페이지</Link></MenuItem>
    <MenuItem><Link to="/auth/logout" className={styles.menuItem}>로그아웃</Link></MenuItem>
  </>);
  const guestMenu = (<>
    <MenuItem><Link to="/auth/login" className={styles.menuItem}>로그인</Link></MenuItem>
    <MenuItem><Link to="/auth/join" className={styles.menuItem}>회원가입</Link></MenuItem>
  </>);

  return (
    <div className={styles.root}>
      <AppBar position="fixed" style={{zIndex: 9999}} className={styles.appbar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            Photos
          </Typography>
          <div className={styles.userBtn}>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleMenuClose}
              style={{zIndex: 100000}}
            >
              {isLoggedIn ? userMenu : guestMenu}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} className={styles.drawer}>
        <div className={styles.drawerSpacing} />
        <List>
          <Link to="/" className={styles.menuItem}>
            <ListItem button>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="메인 화면" />
            </ListItem>
          </Link>
          <Link to="/me" className={styles.menuItem}>
            <ListItem button>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="마이페이지" />
            </ListItem>
          </Link>
        </List>
      </Drawer>
      <div className={styles.child}>
        {props.children}
      </div>
    </div>
  );
}