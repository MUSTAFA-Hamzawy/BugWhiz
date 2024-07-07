import React from 'react';
import logo from '../../Assets/logo.jpeg';
import { NavLink, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Logout from '@mui/icons-material/Logout';
import styles from './Header.module.css';
import CreateProjectModal from './CreateProjectModal'; // import the modal component

const Header = ({ userState, fetchProjects }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false); // modal state
  const open = Boolean(anchorEl);
  const navigate = useNavigate(); // get navigate function from react-router-dom

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleClose();
  };

  const handleLogout = () => {
    // Clear the authentication token from local storage
    localStorage.removeItem('authToken');
    // Optionally reset any user state here
    // Redirect to the login page
    navigate("/login", { replace: true });
  };

  const userData = userState?.userData;

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerLogo}>
        <NavLink to="/projects">
          <img src={logo} alt="BugWhiz Logo" />
        </NavLink>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
        <div className={styles.headerLink}>
          <NavLink to="/Projects" className={({ isActive }) => isActive ? styles.active : ''}>
            Projects
          </NavLink>
        </div>
        <button className={styles.buttonCommon} onClick={handleModalOpen}>Create Project</button>
      </div>
      <div className={styles.accountMenuContainer}>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <div style={{cursor:'pointer'}}>
            <NotificationsNoneOutlinedIcon fontSize="large"/>
          </div>
          <Tooltip title="Account Info">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 44, height: 44, fontSize: '17px', fontWeight: 'bold' }} alt={userData?.fullName} src={userData?.image ? `http://51.20.81.93/${userData?.image}` : null} />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <div className={styles.dropdownAccount}>
          <Avatar sx={{ width: 32, height: 32, fontSize: '17px', fontWeight: 'bold' }} alt={userData?.fullName} src={userData?.image ? `http://51.20.81.93/${userData?.image}` : null} />
            <div className={styles.dropdownDetails}>
              <div style={{fontWeight:'bold'}}>{userData?.fullName}</div>
              <div style={{ fontSize: '14px' }}>{userData?.email}</div>
            </div>
          </div>
          <MenuItem sx={{ marginTop: '7px' }} onClick={handleProfileClick}>
          <Avatar sx={{ width: 32, height: 32, fontSize: '17px', fontWeight: 'bold' }} alt={userData?.fullName} src={userData?.image ? `http://51.20.81.93/${userData?.image}` : null} />
              Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
        <button className={styles.buttonCommon} onClick={handleLogout}>Logout</button>
      </div>
      <CreateProjectModal open={modalOpen} handleClose={handleModalClose} fetchProjects={fetchProjects} /> {/* render the modal */}
    </div>
  );
};

export default Header;
