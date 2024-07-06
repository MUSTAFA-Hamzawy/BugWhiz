import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import styles from './CreateProjectModal.module.css';

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

const CreateProjectModal = ({ open, handleClose, fetchProjects }) => {
  const [projectName, setProjectName] = React.useState('');

  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('http://51.20.81.93:80/api/project', { projectName }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchProjects();
      handleModalClose();
    } catch (error) {
      console.error('There was an error creating the project!', error);
    }
  };

  const handleModalClose = () => {
    setProjectName('');
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
          Create New Project
        </Typography>
        <TextField
          label="Project Name"
          variant="outlined"
          fullWidth
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          sx={{ mt: 2, mb: 0.3 }}
          InputProps={{
            style: { fontSize: '16px' , padding:'10px 0'
          }}}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button className={styles.okButton} onClick={handleCreateProject}>
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

export default CreateProjectModal;