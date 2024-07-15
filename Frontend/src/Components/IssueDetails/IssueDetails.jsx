import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Comment } from "../Comments/CommentSystem";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Box,
  Modal,
  IconButton
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import EditIssueModal from './EditIssueModal';
import styles from "./IssueDetails.module.css";
import HelmetComponent from '../../HelmetComponent';
import Header from '../Header/Header';

const comments = {
  id: 1,
  name: "",
  items: [],
};

const IssueDetails = ({ userState }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { issueId } = location.state || {};

  const [updateNotify, setUpdateNotify] = useState(false);
  const [commentsData, setCommentsData] = useState(comments);
  const [issueData, setIssueData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [duplicatedIssues, setDuplicatedIssues] = useState([]);
  const [loadingDuplicates, setLoadingDuplicates] = useState(false);
  const [duplicatesModalOpen, setDuplicatesModalOpen] = useState(false);

  const handleBack = () => {
    navigate('/issues', { state: { projectId: issueData.projectID._id, projectName: issueData.projectID.projectName } });
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${process.env.REACT_APP_BUGWHIZ_API_URL}/api/comment?ticketID=${issueId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCommentsData({ id: 1, name: "", items: response.data });
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchIssueDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${process.env.REACT_APP_BUGWHIZ_API_URL}/api/ticket?ticketID=${issueId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIssueData(response.data);
    } catch (error) {
      console.error('Error fetching issue details:', error);
    }
  };

  const fetchDuplicatedIssues = async () => {
    setLoadingDuplicates(true);
    setDuplicatesModalOpen(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${process.env.REACT_APP_BUGWHIZ_API_URL}/api/ticket/duplicates?ticketID=${issueId}&projectID=${issueData.projectID._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDuplicatedIssues(response.data);
    } catch (error) {
      console.error('Error fetching duplicated issues:', error);
    } finally {
      setLoadingDuplicates(false);
    }
  };

  useEffect(() => {
    if (issueId) {
      fetchIssueDetails();
      fetchComments();
    }
  }, [issueId]);

  const handleOpenModal = async () => {
    await fetchIssueDetails();
    setOpenModal(true);
  };

  const handleViewIssueDetails = (issueID) => {
    navigate('/issueDetails', { state: { issueId: issueID } });
    setDuplicatesModalOpen(false);
  };

  const handleOpenDuplicatesModal = async () => {
    fetchDuplicatedIssues();
  };

  const handleCloseDuplicatesModal = () => {
    setDuplicatesModalOpen(false);
  };

  if (!issueData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const baseUrl = `${process.env.REACT_APP_BUGWHIZ_API_URL}`;

  return (
    <>
      <Header userState={userState} updateNotify={updateNotify} />
      <Box className={styles.issueContainer} display="flex" flexDirection="column" alignItems="center" p={1}>
        <HelmetComponent title="Issue Details - BugWhiz" description="Manage issue details" />
        <Box width="100%" maxWidth="1200px">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Typography variant="subtitle1" color="#213351" gutterBottom>
              Projects / {issueData.projectID.projectName} / {issueData.name}
            </Typography>
            <Button onClick={handleBack} className={styles.buttonCommon} sx={{ height: '36px', color: '#213351', textTransform: 'none' }}>
              Back To Issues
            </Button>
            <Button onClick={handleOpenDuplicatesModal} className={styles.buttonCommon} sx={{ height: '36px', color: '#213351', textTransform: 'none' }}>
              Get Duplicates
            </Button>
          </div>
          <Typography variant="h6" fontWeight="bold" color="#213351" gutterBottom>
            {issueData.title}
          </Typography>
          <Box className={styles.issueBody} flexDirection="column" gap={2}>
            <Card sx={{ flex: 1, boxShadow: 3 }} className={styles.cardBody}>
              <CardContent>
                <Typography sx={{ mb: 1.5 }} variant="h6" fontWeight="bold" color="#213351" gutterBottom>Details</Typography>
                <div className={styles.detailsContainer}>
                  <div className={styles.detailsItem}>
                    <Typography variant="subtitle1">
                      <span style={{ color: '#007bff' }} className={styles.detailsLabel}>Name :</span> {issueData.name}
                    </Typography>
                  </div>
                  <div className={styles.detailsItem}>
                    <Typography variant="subtitle1">
                      <span style={{ color: '#007bff' }} className={styles.detailsLabel}>Title :</span> {issueData.title}
                    </Typography>
                  </div>
                  <div className={styles.detailsRow}>
                    <div className={styles.detailsItem}>
                      <Typography variant="subtitle2" display="flex" alignItems="center" fontSize="17px" gap="4px">
                        <span style={{ color: '#007bff' }} className={styles.detailsLabelStatus}>Status :</span> {issueData.ticketStatus === "Progress" ? `In ${issueData.ticketStatus}` : issueData.ticketStatus}
                      </Typography>
                    </div>
                    <div className={styles.detailsItem}>
                      <Typography variant="subtitle2" display="flex" alignItems="center" fontSize="17px" gap="4px">
                        <span style={{ color: '#007bff' }} className={styles.detailsLabelStatus}>Priority :</span> {issueData.priority}
                      </Typography>
                    </div>
                    <div className={styles.detailsItem}>
                      <Typography variant="subtitle2" display="flex" alignItems="center" fontSize="17px" gap="4px">
                        <span style={{ color: '#007bff' }} className={styles.detailsLabel}>Category :</span> {issueData.category}
                      </Typography>
                    </div>
                  </div>
                  <div className={styles.detailsItem}>
                    <Typography variant="subtitle2" display="flex" alignItems="center" fontSize="17px">
                      <span style={{ color: '#007bff' }} className={styles.detailsLabel}>Description</span>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.2 }}>
                      {issueData.description}
                    </Typography>
                  </div>
                  {issueData.images && issueData.images.length > 0 && (
                    <div className={styles.outerDiv}>
                      <div className={styles.imageGrid}>
                        {issueData.images.map((image, index) => (
                          <div key={index} className={styles.imageContainer}>
                            <img src={`${baseUrl}${image.replace('C:\\Users\\ascom\\Desktop\\karim\\GP\\backend_gp\\BugWhiz\\Backend', '')}`} alt={`Issue related ${index}`} className={styles.issueImage} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className={styles.detailsRow}>
                    <div className={styles.detailsLabel}>Assignee</div>
                    <div className={styles.detailsValue}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }} alt={issueData.developerID ? issueData.developerID.fullName : null} src={issueData.developerID && issueData.developerID.image ? `${process.env.REACT_APP_BUGWHIZ_API_URL}/${issueData.developerID.image}` : null} />
                      <Typography variant="body1">{issueData.developerID ? issueData.developerID.fullName : 'Unassigned'}</Typography>
                    </div>
                  </div>
                  <div className={styles.detailsRow}>
                    <div className={styles.detailsLabel}>Reporter</div>
                    <div className={styles.detailsValue}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }} alt={issueData.reporterID.fullName} src={issueData.reporterID && issueData.reporterID.image ? `${process.env.REACT_APP_BUGWHIZ_API_URL}/${issueData.reporterID.image}` : null} />
                      <Typography variant="body1">{issueData.reporterID.fullName}</Typography>
                    </div>
                  </div>
                  <div className={styles.detailsItem}>
                    <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                      <span style={{ color: '#007bff', marginRight: '4px' }}>Created at</span> {new Date(issueData.createdAt).toLocaleString('en-GB')}
                    </Typography>
                    <Typography variant="caption" display="block">
                      <span style={{ color: '#007bff', marginRight: '4px' }}>Updated at</span> {new Date(issueData.updatedAt).toLocaleString('en-GB')}
                    </Typography>
                  </div>
                  <div className={styles.detailsItem} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button className={styles.buttonCommon} variant="contained" color="primary" onClick={handleOpenModal}>
                      Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Box flex={1.1} className={styles.commentSection}>
              <Comment
                comment={commentsData}
                issueId={issueId}
                fetchComments={fetchComments}
              />
            </Box>
          </Box>
        </Box>
        <EditIssueModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          setOpenModal={setOpenModal}
          category={issueData.category}
          description={issueData.description}
          developerID={issueData.developerID ? issueData.developerID._id : null}
          priority={issueData.priority}
          title={issueData.title}
          ticketStatus={issueData.ticketStatus}
          ticketID={issueData._id}
          fetchIssueDetails={fetchIssueDetails}
          setUpdateNotify={setUpdateNotify}
          projectID={issueData.projectID._id}
        />
        <Modal open={duplicatesModalOpen} onClose={handleCloseDuplicatesModal}>
          <Box className={styles.overlayModal}>
            <Box className={styles.modalHeader}>
              <Typography variant="h6" gutterBottom>Duplicated Issues</Typography>
              <IconButton aria-label="close" onClick={handleCloseDuplicatesModal}>
                <CloseIcon />
              </IconButton>
            </Box>
            {loadingDuplicates ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                <CircularProgress />
              </Box>
            ) : (
              <>
                {duplicatedIssues.length > 0 ? (
                  <Box>
                    <table className={styles.duplicatesTable}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Similarity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {duplicatedIssues.map((duplicate, index) => (
                          <tr key={index}>
                            <td onClick={() => handleViewIssueDetails(duplicate._id)} className={styles.issueLink}>{duplicate.name}</td>
                            <td>{duplicate.similarity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                ) : (
                  <Typography>No duplicated issues found</Typography>
                )}
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </>
  );
}

export default IssueDetails;
