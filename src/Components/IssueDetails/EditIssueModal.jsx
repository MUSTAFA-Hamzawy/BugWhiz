
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

const EditIssueModal = ({ open, handleClose, issueData, fetchIssueDetails }) => {
  const [formData, setFormData] = useState(issueData);
  const [developers, setDevelopers] = useState([]);

  useEffect(() => {
    if (open) {
      setFormData(issueData);
    }
  }, [issueData, open]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const payload = {
        ticketID: formData._id,
        developerID: formData.developerID,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        ticketStatus: formData.ticketStatus
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

  const selectedDeveloper = getDeveloperDetails(formData.developerID);

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
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="ticketStatus"
                value={formData.ticketStatus}
                onChange={handleChange}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="TODO">TODO</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="DONE">DONE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
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
                value={formData.category}
                onChange={handleChange}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Frontend">Frontend</MenuItem>
                <MenuItem value="Backend">Backend</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Developer</InputLabel>
              <Select
                label="Developer"
                name="developerID"
                value={formData.developerID}
                onChange={handleChange}
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
            {formData.developerID.fullName && (
              <Box mt={2} display="flex" alignItems="center">
                <Avatar alt={formData.developerID.fullName} src={formData.developerID.image} />
                <Typography variant="body1" ml={2}>
                  {formData.developerID.fullName}
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

