import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import Badge from '@mui/material/Badge';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Logout from '@mui/icons-material/Logout';
import styles from './Header.module.css';
import CreateProjectModal from './CreateProjectModal';

const Header = ({ userState, fetchProjects }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); 
  const [notifications, setNotifications] = useState([]);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const open = Boolean(anchorEl);
  const openNotif = Boolean(anchorElNotif);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://51.20.81.93/api/notify', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        console.log(response);
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifClick = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotifClose = () => {
    setAnchorElNotif(null);
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
    localStorage.removeItem('authToken');
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
          <div style={{ cursor: 'pointer' }}>
            <IconButton onClick={handleNotifClick}>
              <Badge badgeContent={notifications?.length || 0} color="error">
                <NotificationsNoneOutlinedIcon fontSize="large" />
              </Badge>
            </IconButton>
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
              <div style={{ fontWeight: 'bold' }}>{userData?.fullName}</div>
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
      <CreateProjectModal open={modalOpen} handleClose={handleModalClose} fetchProjects={fetchProjects} /> 
      <Menu
        anchorEl={anchorElNotif}
        id="notification-menu"
        open={openNotif}
        onClose={handleNotifClose}
        onClick={handleNotifClose}
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
        {notifications?.length > 0 ? (
          notifications.map((notification, index) => (
            <MenuItem key={index}>
              <div>
                <strong>{notification.title}</strong>
                <p>{notification.body}</p>
              </div>
            </MenuItem>
          ))
        ) : (
          <MenuItem>No notifications</MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default Header;
