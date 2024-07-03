import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Comment, useNode } from "../Comments/CommentSystem";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Button,
  Box
} from '@mui/material';
import EditIssueModal from './EditIssueModal'; // Import the modal
import styles from "./IssueDetails.module.css";

const comments = {
  id: 1,
  name:"",
  items: [],
};

const IssueDetails = () => {
  const location = useLocation();
  const { issueId } = location.state || {};

  const [commentsData, setCommentsData] = useState(comments);
  const [issueData, setIssueData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const { insertNode, editNode, deleteNode } = useNode();

  const handleInsertNode = (folderId, item) => {
    const finalStructure = insertNode(commentsData, folderId, item);
    setCommentsData(finalStructure);
  };

  const handleEditNode = (folderId, value) => {
    const finalStructure = editNode(commentsData, folderId, value);
    setCommentsData(finalStructure);
  };

  const handleDeleteNode = (folderId) => {
    const finalStructure = deleteNode(commentsData, folderId);
    const temp = { ...finalStructure };
    setCommentsData(temp);
  };


  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://51.20.81.93:80/api/comment?ticketID=${issueId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log( response.data);
      setCommentsData({ id: 1, name: "", items: response.data });
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchIssueDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://51.20.81.93:80/api/ticket?ticketID=${issueId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIssueData(response.data);
    } catch (error) {
      console.error('Error fetching issue details:', error);
    }
  };

  useEffect(() => {
    if(issueId){
        fetchIssueDetails();
        fetchComments();
    }
  }, [issueId]);

  const handleOpenModal = async () => {
    await fetchIssueDetails();
    setOpenModal(true);
  };

  if (!issueData) {
    return <div>Loading...</div>;
  }

  return (
    <Box className={styles.issueContainer} display="flex" flexDirection="column" alignItems="center" p={2}>
      <Box width="100%" maxWidth="1200px">
        <Typography variant="subtitle1" color="#213351" gutterBottom>
          Projects / {issueData.projectID.projectName} / {issueData.name}
        </Typography>
        <Typography variant="h6" fontWeight="bold" color="#213351" gutterBottom>
          {issueData.title}
        </Typography>
        <Box className={styles.issueBody} flexDirection="column" gap={2}>
          <Card sx={{ flex: 1, boxShadow: 3 }}>
            <CardContent>
              <Typography sx={{ mb: 1.5 }} variant="h6" gutterBottom>Details</Typography>
              <Grid container direction="column" spacing={1.7}>
                <Grid item>
                  <Typography variant="subtitle1">
                    <span style={{ color: '#007bff' }}>Name :</span> {issueData.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    <span style={{ color: '#007bff' }}>Title :</span> {issueData.title}
                  </Typography>
                </Grid>
                <Grid item container spacing={2}>
                  <Grid item>
                    <Typography variant="subtitle2" display="flex" alignItems="center" fontSize="17px" gap="4px">
                      <span style={{ color: '#007bff' }}>Status :</span> {issueData.ticketStatus}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" display="flex" alignItems="center" fontSize="17px" gap="4px">
                      <span style={{ color: '#007bff' }}>Priority :</span> {issueData.priority}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" display="flex" alignItems="center" fontSize="17px" gap="4px">
                      <span style={{ color: '#007bff' }}>Category :</span> {issueData.category}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2" display="flex" alignItems="center" fontSize="17px">
                    <span style={{ color: '#007bff' }}>Description</span>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {issueData.description}
                  </Typography>
                </Grid>
                <Grid item container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography variant="body2"><span style={{ color: '#007bff' }}>Assignee</span></Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems="center">
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }} />
                    <Typography variant="body2">{issueData.developerID ? issueData.developerID.fullName : 'Unassigned'}</Typography>
                  </Grid>
                </Grid>
                <Grid item container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography variant="body2"><span style={{ color: '#007bff' }}>Reporter</span></Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems="center">
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }} />
                    <Typography variant="body2">{issueData.reporterID.fullName}</Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                    <span style={{ color: '#007bff' }}>Created at</span> {new Date(issueData.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" display="block">
                    <span style={{ color: '#007bff' }}>Updated at</span> {new Date(issueData.updatedAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item container justifyContent="flex-end">
                  <Button className={styles.buttonCommon} variant="contained" color="primary" onClick={handleOpenModal}>
                    Update
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Box flex={1.1} className={styles.commentSection}>
            <Comment
              handleInsertNode={handleInsertNode}
              handleEditNode={handleEditNode}
              handleDeleteNode={handleDeleteNode}
              comment={commentsData}
              issueId = {issueId}
              fetchComments={fetchComments}
            />
          </Box>
        </Box>
      </Box>
      <EditIssueModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        issueData={issueData}
        fetchIssueDetails={fetchIssueDetails}
      />
    </Box>
  );
}

export default IssueDetails;
