import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PredictedDevelopersModal.module.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 1.5,
  pr: 4,
  pl: 4,
  pb: 2,
};

const PredictedDevelopersModal = ({ open, handleClose, predictedData }) => {

  const navigate = useNavigate();
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState('');


  const handleViewIssueDetails = (issueID) => {
    navigate('/issueDetails', { state: { issueId: issueID } });
  };

  const handleAssignDeveloper = async () => {
    if (!selectedDeveloper) {
      setError('Please select a developer');
      return;
    }

    const updatedTicket = {
      ticketID: predictedData.newTicket._id,
      developerID: selectedDeveloper,
      title: predictedData.newTicket.title,
      description: predictedData.newTicket.description,
      category: predictedData.newTicket.category,
      priority: predictedData.newTicket.priority,
      ticketStatus: predictedData.newTicket.ticketStatus,
    };

    const token = localStorage.getItem('authToken');

    try {
      const response = await axios.patch(`${process.env.REACT_APP_BUGWHIZ_API_URL}/api/ticket`, updatedTicket, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setError('');
      setDone('User assigned successfully');


    } catch (error) {
      console.error('There was an error updating the ticket!', error);
    }
  };

  const handleCancel = () => {
    handleClose();
    setSelectedDeveloper('');
    setError('');
    setDone('');
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight='bold'>
          Predicted Developers and Duplicated Issues
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Box sx={{ width: '45%' }}>
            <Typography variant="h6" component="h3" fontSize='18px' fontWeight='bold' color='rgb(33, 51, 81)'>
              Duplicated Issues
            </Typography>
            {predictedData.duplicates.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ color: 'rgb(33, 51, 81)' }}>Name</th>
                    <th style={{ color: 'rgb(33, 51, 81)' }}>Similarity</th>
                  </tr>
                </thead>
                <tbody>
                  {predictedData.duplicates.map((duplicate) => (
                    <tr key={duplicate._id}>
                      <td onClick={() => handleViewIssueDetails(duplicate._id)} className={styles.issueLink}>{duplicate.name}</td>
                      <td>{duplicate.similarity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Typography>No duplicates</Typography>
            )}
          </Box>
          <Box sx={{ width: '45%' }}>
            <Typography variant="h6" component="h3" fontSize='18px' fontWeight='bold' color='rgb(33, 51, 81)'>
              Predicted Developers
            </Typography>
            {predictedData.predictedDevelopers.length > 0 ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <select className={styles.select} value={selectedDeveloper} onChange={(e) => setSelectedDeveloper(e.target.value)}>
                  <option value="" disabled>
                    Select a developer
                  </option>
                  {predictedData.predictedDevelopers.map((developer) => (
                    <option key={developer._id} value={developer._id}>
                      {developer.fullName}
                    </option>
                  ))}
                </select>
                <Button className={styles.okButton} onClick={handleAssignDeveloper}>
                  Assign
                </Button>
              </div>
            ) : (
              <Typography>No predicted developers</Typography>
            )}
            {error ? <span style={{ color: 'red', fontSize: '15px' }}>{error}</span> : null}
            {done ? <span style={{ color: 'green', fontSize: '15px' }}>{done}</span> : null}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button className={styles.okButton} onClick={() => handleViewIssueDetails(predictedData.newTicket._id)}>
            View created issue Details
          </Button>
          <Button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PredictedDevelopersModal;
