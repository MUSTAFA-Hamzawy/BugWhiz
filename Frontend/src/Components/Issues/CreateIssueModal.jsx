import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import PredictedDevelopersModal from './PredictedDevelopersModal'; // Import the new modal component
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
  const [predictedData, setPredictedData] = useState(null); 
  const [predictedModalOpen, setPredictedModalOpen] = useState(false); 

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

      const response = await axios.post('http://51.20.81.93:80/api/ticket', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("post response",response);
      setError('');
      fetchIssues(false);
      setPredictedData(response.data); // Store the response data
      setPredictedModalOpen(true); // Open the new modal
      
      handleModalClose();
    } catch (error) {
      setError(error.response.data.errorDescription);
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
    <>
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
    {predictedData && (
        <PredictedDevelopersModal
          open={predictedModalOpen}
          handleClose={() => setPredictedModalOpen(false)}
          predictedData={predictedData}
        />
      )}
    </>
  );
};

export default CreateIssueModal;
