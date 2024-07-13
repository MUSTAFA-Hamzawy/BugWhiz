import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../../Assets/logo.jpeg';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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

const Header = ({ userState, fetchProjects, updateNotify }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); 
  const [notifications, setNotifications] = useState([]);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const open = Boolean(anchorEl);
  const openNotif = Boolean(anchorElNotif);
  const navigate = useNavigate(); 
  const location = useLocation();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BUGWHIZ_API_URL}/api/notify`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        console.log(response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, [updateNotify]);

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

  const handleViewIssueDetails = (issueID) => {
    navigate('/issueDetails', { state: { issueId: issueID} });
  };

  const handleViewIssues = (projectID, projectName) => {
    navigate('/issues', { state: { projectId: projectID, projectName: projectName } });
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

  const handleMarkAsRead = async () => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_BUGWHIZ_API_URL}/api/notify`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      console.log(response.data);
      setNotifications([]);
    } catch (error) {
      console.error(error);
    }
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
          <NavLink style={{fontSize:'19px'}} to="/Projects" className={({ isActive }) => isActive ? styles.active : ''}>
            Projects
          </NavLink>
        </div>
        {(location.pathname === '/Projects' || location.pathname === '/projects') && (
        <button className={styles.buttonCommon} onClick={handleModalOpen}>Create Project</button>
      )}
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
              <Avatar sx={{ width: 44, height: 44, fontSize: '17px', fontWeight: 'bold' }} alt={userData?.fullName} src={userData?.image ? `${process.env.REACT_APP_BUGWHIZ_API_URL}/${userData?.image}` : null} />
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
            <Avatar sx={{ width: 32, height: 32, fontSize: '17px', fontWeight: 'bold' }} alt={userData?.fullName} src={userData?.image ? `${process.env.REACT_APP_BUGWHIZ_API_URL}/${userData?.image}` : null} />
            <div className={styles.dropdownDetails}>
              <div style={{ fontWeight: 'bold' }}>{userData?.fullName}</div>
              <div style={{ fontSize: '14px' }}>{userData?.email}</div>
            </div>
          </div>
          <MenuItem sx={{ marginTop: '7px' }} onClick={handleProfileClick}>
            <Avatar sx={{ width: 32, height: 32, fontSize: '17px', fontWeight: 'bold' }} alt={userData?.fullName} src={userData?.image ? `${process.env.REACT_APP_BUGWHIZ_API_URL}/${userData?.image}` : null} />
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
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'auto',
            maxHeight: 300, 
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 280,  
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
        MenuListProps={{
          sx: {
            paddingBottom: 0, 
            paddingTop:0,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {notifications?.length > 0 ? (<MenuItem className={styles.buttonMenu} onClick={handleMarkAsRead}>Mark as read</MenuItem>) :null}
        {notifications?.length > 0 ? (
          notifications.slice().reverse().map((notification, index) => (
            <MenuItem key={index} className={styles.notificationItem} 
            onClick={() => {
              if (notification.projectID === null) {
                handleViewIssueDetails(notification.ticketID);
              } else {
                handleViewIssues(notification.projectID,notification.projectName);
              }
            }}
            >
              <div className={styles.notificationContent}>
                <p style={{marginTop:'8px', marginBottom:'5px'}}>{notification.content}</p>
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
