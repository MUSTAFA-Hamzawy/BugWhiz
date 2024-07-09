import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import styles from './CreateIssueModal.module.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const CreateIssueModal = ({ open, handleClose, projectId, fetchIssues }) => {
  const [issueData, setIssueData] = useState({
    name: '',
    title: '',
    description: '',
    images: [],
  });

  const [error, setError] = React.useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIssueData({
      ...issueData,
      [name]: value,
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    setIssueData(prevState => ({
      ...prevState,
      images: [...prevState.images, ...acceptedFiles],
    }));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  const handleCreateIssue = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const { name, title, description, images } = issueData;

      const formData = new FormData();
      formData.append('name', name);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('projectID', projectId);

      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      await axios.post('http://51.20.81.93:80/api/ticket', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setError('');
      fetchIssues(false);
      Swal.fire({
        icon: 'success',
        title: 'Issue created Successfully',
        showConfirmButton: false,
        timer: 1500,
        position: 'center',
        customClass: {
          popup: styles.swalCustomPopup,
          icon: styles.swalCustomIcon,
          title: styles.swalCustomTitle,
        }
      });
      handleModalClose();
    } catch (error) {
      setError(error.response.data.errorDescription);
      console.log(error.response.data.errorDescription);
      console.error('There was an error creating the issue!', error);
    }
  };

  const handleModalClose = () => {
    setIssueData({
      name: '',
      title: '',
      description: '',
      images: [],
    });
    setError('');
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create New Issue
        </Typography>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          name="name"
          value={issueData.name}
          onChange={handleChange}
          sx={{ mt: 2, cursor: 'pointer' }}
          InputProps={{
            style: { fontSize: '16px', padding: '10px 0' }
          }}
        />
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          name="title"
          value={issueData.title}
          onChange={handleChange}
          sx={{ mt: 2, cursor: 'pointer' }}
          InputProps={{
            style: { fontSize: '16px', padding: '10px 0' }
          }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          name="description"
          value={issueData.description}
          onChange={handleChange}
          sx={{ mt: 2, cursor: 'pointer' }}
          InputProps={{
            style: { fontSize: '16px', padding: '10px 0' }
          }}
        />
        <div {...getRootProps({ className: 'dropzone' })} style={{ color: '#007bff', border: '1px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px', cursor: 'pointer' }}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop images here, or click to select images</p>
          {issueData.images.length > 0 && (
            <div>
              {issueData.images.map((file, index) => (
                <p style ={{color: '#000'}} key={index}>Selected file: {file.name}</p>
              ))}
            </div>
          )}
        </div>
        <div style={{textAlign:'center', marginTop:'8px'}}>
        {error ? (<span style={{color:'red', fontSize:'16px'}}>{error}</span>):null}
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button className={styles.okButton} onClick={handleCreateIssue}>
            OK
          </Button>
          <Button className={styles.cancelButton} onClick={handleModalClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateIssueModal;
