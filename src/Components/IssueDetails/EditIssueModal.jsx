import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Avatar
} from '@mui/material';
import styles from "./EditIssueModal.module.css";

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

const EditIssueModal = ({ open, handleClose, category, description, developerID, priority, title, ticketStatus, ticketID, fetchIssueDetails }) => {
  const [formCategory, setFormCategory] = useState(category);
  const [formDescription, setFormDescription] = useState(description);
  const [formDeveloperID, setFormDeveloperID] = useState(developerID);
  const [formPriority, setFormPriority] = useState(priority);
  const [formTitle, setFormTitle] = useState(title);
  const [formTicketStatus, setFormTicketStatus] = useState(ticketStatus);
  const [developers, setDevelopers] = useState([]);

  console.log(category, description, developerID, priority, title, ticketStatus, ticketID);
  useEffect(() => {
    if (open) {
      setFormCategory(category);
      setFormDescription(description);
      setFormDeveloperID(developerID);
      setFormPriority(priority);
      setFormTitle(title);
      setFormTicketStatus(ticketStatus);
    }
  }, [category, description, developerID, priority, title, ticketStatus, open]);

  const fetchDevelopers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://51.20.81.93:80/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDevelopers(response.data);
    } catch (error) {
      console.error('Error fetching developers:', error);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const payload = {
        ticketID,
        developerID: formDeveloperID,
        title: formTitle,
        description: formDescription,
        category: formCategory,
        priority: formPriority,
        ticketStatus: formTicketStatus
      };
      console.log(payload);
      await axios.patch('http://51.20.81.93:80/api/ticket', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchIssueDetails();
      handleClose();
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };

  const getDeveloperDetails = (id) => {
    const developer = developers.find(dev => dev._id === id);
    return developer || { fullName: 'None', image: null };
  };

  const selectedDeveloper = formDeveloperID ? getDeveloperDetails(formDeveloperID) : { fullName: 'None', image: null };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-issue-modal-title"
      aria-describedby="edit-issue-modal-description"
    >
      <Box sx={style}>
        <Typography id="edit-issue-modal-title" variant="h6" component="h2">
          Edit Issue
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formTitle || ''}
              onChange={(e) => setFormTitle(e.target.value)}
              InputProps={{
                style: { fontSize: '16px', padding: '10px 0' }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formDescription || ''}
              onChange={(e) => setFormDescription(e.target.value)}
              InputProps={{
                style: { fontSize: '16px', padding: '10px 0' }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="ticketStatus"
                value={formTicketStatus || 'None'}
                onChange={(e) => setFormTicketStatus(e.target.value)}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="TODO">TODO</MenuItem>
                <MenuItem value="Progress">In Progress</MenuItem>
                <MenuItem value="Done">DONE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                label="Priority"
                name="priority"
                value={formPriority || 'None'}
                onChange={(e) => setFormPriority(e.target.value)}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="P1">P1</MenuItem>
                <MenuItem value="P2">P2</MenuItem>
                <MenuItem value="P3">P3</MenuItem>
                <MenuItem value="P4">P4</MenuItem>
                <MenuItem value="P5">P5</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                name="category"
                value={formCategory || 'None'}
                onChange={(e) => setFormCategory(e.target.value)}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Frontend">Frontend</MenuItem>
                <MenuItem value="Backend">Backend</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
                <MenuItem value="Documentation">Documentation</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Developer</InputLabel>
              <Select
                label="Developer"
                name="developerID"
                value={formDeveloperID || ''}
                onChange={(e) => setFormDeveloperID(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200, // Adjust max height for the dropdown
                    },
                  },
                }}
              >
                {developers.map(dev => (
                  <MenuItem key={dev._id} value={dev._id}>
                    {dev.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {formDeveloperID && selectedDeveloper.fullName !== 'None' && (
              <Box mt={2} display="flex" alignItems="center">
                <Avatar alt={selectedDeveloper.fullName} src={selectedDeveloper.image} />
                <Typography variant="body1" ml={2}>
                  {selectedDeveloper.fullName}
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="space-between">
            <Button className={styles.cancelButton} onClick={handleClose} variant="contained">
              Cancel
            </Button>
            <Button className={styles.okButton} onClick={handleSubmit} variant="contained">
              OK
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default EditIssueModal;
