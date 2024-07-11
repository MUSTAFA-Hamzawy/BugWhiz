import React, { useState } from 'react';
import { Card, CardContent, Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import styles from './Profile.module.css';
import axios from 'axios';
import HelmetComponent from '../../HelmetComponent';


const Profile = ({ userState, setUserState }) => {
  const userData = userState?.userData;
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    jobTitle: '',
    profileImage: '',
    coverImage: ''
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [profileImageName, setProfileImageName] = useState('');
  const [coverImageName, setCoverImageName] = useState('');

  const [error, setError] = React.useState('');

  const { 
    fullName, 
    email, 
    username, 
    phoneNumber, 
    jobTitle, 
    image: profileImage, 
    headerImage: coverImage 
  } = userData || {};

  const handleOpen = () => {
    setFormData({
      fullName,
      phoneNumber,
      jobTitle,
      profileImage,
      coverImage
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetFileSelections();
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropProfileImage = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFormData({ ...formData, profileImage: file });
    setProfileImageFile(file);
    setProfileImageName(file.name);
  };

  const handleDropCoverImage = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFormData({ ...formData, coverImage: file });
    setCoverImageFile(file);
    setCoverImageName(file.name);
  };

  const handleSubmit = async () => {
    const { fullName, phoneNumber, jobTitle } = formData;

    if (!fullName) {
        setError('Full Name is required');
        return;
    }

    if (!jobTitle) {
        setError('Job Title is required');
        return;
    }

    if (!phoneNumber) {
        setError('Phone Number is required');
        return;
    }

    const validatePhoneNumber = (phoneNumber) => {
        const regex = /^(?:\+2)?(011|012|015|010)\d{8}$/;
        return regex.test(phoneNumber);
    };

    if (!validatePhoneNumber(phoneNumber)) {
        setError('Phone Number is invalid');
        return;
    }

    const data = new FormData();
    data.append('fullName', fullName);
    data.append('phoneNumber', phoneNumber);
    data.append('jobTitle', jobTitle);

    if (profileImageFile) {
        data.append('image', profileImageFile);
    }

    if (coverImageFile) {
        data.append('headerImage', coverImageFile);
    }

    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.patch('http://51.20.81.93:80/api/user', data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        setError('');
        setUserState(prevState => ({
            ...prevState,
            userData: response.data
        }));

        setOpen(false);
        resetFileSelections();

    } catch (error) {
        setError(error.response.data.errorDescription);
    }
};


  const resetFileSelections = () => {
    setProfileImageFile(null);
    setCoverImageFile(null);
    setProfileImageName('');
    setCoverImageName('');
  };

  const { getRootProps: getProfileImageRootProps, getInputProps: getProfileImageInputProps } = useDropzone({
    onDrop: handleDropProfileImage,
    accept: 'image/*'
  });

  const { getRootProps: getCoverImageRootProps, getInputProps: getCoverImageInputProps } = useDropzone({
    onDrop: handleDropCoverImage,
    accept: 'image/*'
  });

  return (
    <>
      <HelmetComponent title="Profile - BugWhiz" description="Manage your profile" />
      <Card className={styles.profileContainer}>
        <div 
          className={styles.coverImage}
          style={{ backgroundImage: `url(${`http://51.20.81.93/${coverImage}` || ''})` }}
        >
          <Avatar className={styles.profileAvatar} alt={fullName} src={profileImage ? `http://51.20.81.93/${profileImage}` : null} />
          <Button 
            variant="contained" 
            color="primary" 
            className={styles.buttonCommon}
            startIcon={<EditIcon />}
            onClick={handleOpen}
          >
            Update
          </Button>
        </div>
        <CardContent className={styles.profileDetails}>
          {fullName && <Typography className={styles.fullName}>{fullName}</Typography>}
          <div className={styles.outDiv}>
            {email && (
              <div className={styles.inDiv}>
                <span className={styles.label}>Email :</span>
                <span className={styles.value}>{email}</span>
              </div>
            )}
            {username && (
              <div className={styles.inDiv}>
                <span className={styles.label}>Username :</span>
                <span className={styles.value}>{username}</span>
              </div>
            )}
            {phoneNumber && (
              <div className={styles.inDiv}>
                <span className={styles.label}>Phone Number :</span>
                <span className={styles.value}>{phoneNumber}</span>
              </div>
            )}
            {jobTitle && (
              <div className={styles.inDiv}>
                <span className={styles.label}>Job Title :</span>
                <span className={styles.value}>{jobTitle}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { padding: '11px 8px' } }}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="fullName"
            label="Full Name"
            type="text"
            fullWidth
            value={formData.fullName}
            onChange={handleChange}
            InputProps={{
              style: { fontSize: '16px', padding: '10px 0' }
            }}
          />
          <TextField
            margin="dense"
            name="phoneNumber"
            label="Phone Number"
            type="text"
            fullWidth
            value={formData.phoneNumber}
            onChange={handleChange}
            InputProps={{
              style: { fontSize: '16px', padding: '10px 0' }
            }}
          />
          <TextField
            margin="dense"
            name="jobTitle"
            label="Job Title"
            type="text"
            fullWidth
            value={formData.jobTitle}
            onChange={handleChange}
            InputProps={{
              style: { fontSize: '16px', padding: '10px 0' }
            }}
          />
          <div {...getProfileImageRootProps()} className={styles.dropzone}>
            <input {...getProfileImageInputProps()} />
            <p style={{color:'rgb(0, 123, 255)'}}>
              {profileImageName ? `Selected file: ${profileImageName}` : "Drag 'n' drop profile image here, or click to select file"}
            </p>
          </div>
          <div {...getCoverImageRootProps()} className={styles.dropzone} style={{marginBottom:'10px'}}>
            <input {...getCoverImageInputProps()} />
            <p style={{color:'rgb(0, 123, 255)'}}>
              {coverImageName ? `Selected file: ${coverImageName}` : "Drag 'n' drop cover image here, or click to select file"}
            </p>
          </div>
          {error ? (<span style={{color:'red', fontSize:'15px', marginLeft:'195px'}}>{error}</span>):null}
        </DialogContent>
        <DialogActions sx={{display:'flex', justifyContent:'space-between'}}>
          <Button onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className={styles.okButton}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
