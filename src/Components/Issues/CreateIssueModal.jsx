import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
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

const CreateIssueModal = ({ open, handleClose, projectId }) => {
  const [issueData, setIssueData] = useState({
    name: '',
    title: '',
    description: '',
    images: [null, null],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIssueData({
      ...issueData,
      [name]: value,
    });
  };

  const onDrop = useCallback((index, acceptedFiles) => {
    const newImages = [...issueData.images];
    newImages[index] = acceptedFiles[0]; // Only handle single file
    setIssueData({
      ...issueData,
      images: newImages,
    });
  }, [issueData]);

  const { getRootProps: getRootProps0, getInputProps: getInputProps0 } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(0, acceptedFiles),
    accept: 'image/*',
  });

  const { getRootProps: getRootProps1, getInputProps: getInputProps1 } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(1, acceptedFiles),
    accept: 'image/*',
  });

  const handleCreateIssue = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const { name, title, description, images } = issueData;

      // Extract the file names
      const imageNames = images.filter(image => image !== null).map(image => image.name);

      const requestData = {
        name,
        title,
        description,
        images: imageNames,
        projectID: projectId,
      };

      await axios.post('http://51.20.81.93:80/api/ticket', requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(requestData)
      handleModalClose();
    } catch (error) {
      console.error('There was an error creating the issue!', error);
    }
  };

  const handleModalClose = () => {
    setIssueData({
      name: '',
      title: '',
      description: '',
      images: [null, null],
    });
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
        />
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          name="title"
          value={issueData.title}
          onChange={handleChange}
          sx={{ mt: 2, cursor: 'pointer' }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          name="description"
          value={issueData.description}
          onChange={handleChange}
          sx={{ mt: 2, cursor: 'pointer' }}
        />
        <div {...getRootProps0({ className: 'dropzone' })} style={{ color: '#007bff', border: '1px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px', cursor: 'pointer' }}>
          <input {...getInputProps0()} />
          <p>Drag 'n' drop an image here, or click to select an image</p>
          {issueData.images[0] && <p>Selected file: {issueData.images[0].name}</p>}
        </div>
        <div {...getRootProps1({ className: 'dropzone' })} style={{ color: '#007bff', border: '1px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px', cursor: 'pointer' }}>
          <input {...getInputProps1()} />
          <p>Drag 'n' drop an image here, or click to select an image</p>
          {issueData.images[1] && <p>Selected file: {issueData.images[1].name}</p>}
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
