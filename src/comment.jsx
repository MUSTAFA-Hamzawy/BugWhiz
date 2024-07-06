// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Comment } from "../Comments/CommentSystem";
// import {
//   Card,
//   CardContent,
//   Grid,
//   Typography,
//   Avatar,
//   Button,
//   Box
// } from '@mui/material';
// import CircularProgress from '@mui/material/CircularProgress';
// import EditIssueModal from './EditIssueModal'; // Import the modal
// import styles from "./IssueDetails.module.css";

// const comments = {
//   id: 1,
//   name: "",
//   items: [],
// };

// const IssueDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { issueId } = location.state || {};

//   const handleBack = () => {
//     navigate('/issues', { state: { projectId: issueData.projectID._id, projectName: issueData.projectID.projectName } }); // Pass the projectId and projectName
//   };

//   const [commentsData, setCommentsData] = useState(comments);
//   const [issueData, setIssueData] = useState(null);
//   const [openModal, setOpenModal] = useState(false);

//   const fetchComments = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await axios.get(`http://51.20.81.93:80/api/comment?ticketID=${issueId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log(response.data);
//       setCommentsData({ id: 1, name: "", items: response.data });
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     }
//   };

//   const fetchIssueDetails = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await axios.get(`http://51.20.81.93:80/api/ticket?ticketID=${issueId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setIssueData(response.data);
//     } catch (error) {
//       console.error('Error fetching issue details:', error);
//     }
//   };

//   useEffect(() => {
//     if (issueId) {
//       fetchIssueDetails();
//       fetchComments();
//     }
//   }, [issueId]);

//   const handleOpenModal = async () => {
//     await fetchIssueDetails();
//     setOpenModal(true);
//   };

//   if (!issueData) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   const baseUrl = 'http://51.20.81.93';

//   return (
//     <Box className={styles.issueContainer} display="flex" flexDirection="column" alignItems="center" p={2}>
//       <Box width="100%" maxWidth="1200px">
//         <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
//           <Typography variant="subtitle1" color="#213351" gutterBottom>
//             Projects / {issueData.projectID.projectName} / {issueData.name}
//           </Typography>
//           <Button onClick={handleBack} className={styles.buttonCommon} sx={{ height: '36px', color: '#213351', textTransform: 'none' }}>
//             Back To Issues
//           </Button>
//         </div>
//         <Typography variant="h6" fontWeight="bold" color="#213351" gutterBottom>
//           {issueData.title}
//         </Typography>
//         <Box className={styles.issueBody} flexDirection="column" gap={2}>
//           <Card sx={{ flex: 1, boxShadow: 3 }}>
//             <CardContent>
//               <Typography sx={{ mb: 1.5 }} variant="h6" gutterBottom>Details</Typography>
//               <Grid container direction="column" spacing={1.7}>
//                 <Grid item>
//                   <Typography variant="subtitle1">
//                     <span style={{ color: '#007bff' }}>Name :</span> {issueData.name}
//                   </Typography>
//                 </Grid>
//                 <Grid item>
//                   <Typography variant="subtitle1">
//                     <span style={{ color: '#007bff' }}>Title :</span> {issueData.title}
//                   </Typography>
//                 </Grid>
//                 <Grid item container spacing={2}>
//                   <Grid item>
//                     <Typography variant="subtitle2" display="flex" alignItems="center" fontSize="17px" gap="4px">
//                       <span style={{ color: '#007bff' }}>Status :</span> {issueData.ticketStatus}
//                     </Typography>
//                   </Grid>
//                   <Grid item>
//                     <Typography variant="subtitle2" display="flex" alignItems="center" fontSize="17px" gap="4px">
//                       <span style={{ color: '#007bff' }}>Priority :</span> {issueData.priority}
//                     </Typography>
//                   </Grid>
//                   <Grid item>
//                     <Typography variant="subtitle2" display="flex" alignItems="center" fontSize="17px" gap="4px">
//                       <span style={{ color: '#007bff' }}>Category :</span> {issueData.category}
//                     </Typography>
//                   </Grid>
//                 </Grid>
//                 <Grid item>
//                   <Typography variant="subtitle2" display="flex" alignItems="center" fontSize="17px">
//                     <span style={{ color: '#007bff' }}>Description</span>
//                   </Typography>
//                   <Typography variant="body2" sx={{ mb: 0 }}>
//                     {issueData.description}
//                   </Typography>
//                 </Grid>
//                 <div className={styles.outerDiv}>
//                   {issueData.images && issueData.images.length > 0 && (
//                     <div className={styles.imageGrid}>
//                     {issueData.images.map((image, index) => (
//                       <div key={index} className={styles.imageContainer}>
//                         <img src={`${baseUrl}${image.replace('/home/ubuntu/bugwhiz-backend', '')}`} alt={`Issue related ${index}`} className={styles.issueImage} />
//                       </div>
//                     ))}
//                   </div>
//                   )}
//                 </div>
//                 <Grid item container spacing={-70} alignItems="center">
//                   <Grid item xs={3}>
//                     <Typography variant="body2" fontSize="17px"><span style={{ color: '#007bff' }}>Assignee</span></Typography>
//                   </Grid>
//                   <Grid item xs={9} display="flex" alignItems="center">
//                     <Avatar sx={{ width: 32, height: 32, mr: 1 }} alt={issueData.developerID ? issueData.developerID.fullName : null} src={issueData.developerID && issueData.developerID.image ? `http://51.20.81.93/${issueData.developerID.image}` : null} />
//                     <Typography variant="body1">{issueData.developerID ? issueData.developerID.fullName : 'Unassigned'}</Typography>
//                   </Grid>
//                 </Grid>
//                 <Grid item container spacing={-70} alignItems="center">
//                   <Grid item xs={3}>
//                     <Typography variant="body2" fontSize="17px"><span style={{ color: '#007bff' }}>Reporter</span></Typography>
//                   </Grid>
//                   <Grid item xs={9} display="flex" alignItems="center">
//                     <Avatar sx={{ width: 32, height: 32, mr: 1 }} alt={issueData.reporterID.fullName} src={issueData.reporterID && issueData.reporterID.image ? `http://51.20.81.93/${issueData.reporterID.image}` : null} />
//                     <Typography variant="body1">{issueData.reporterID.fullName}</Typography>
//                   </Grid>
//                 </Grid>
//                 <Grid item>
//                   <Typography variant="caption" display="block" sx={{ mt: 2 }}>
//                     <span style={{ color: '#007bff',marginRight:'4px' }}>Created at</span> {new Date(issueData.createdAt).toLocaleString('en-GB')}
//                   </Typography>
//                   <Typography variant="caption" display="block">
//                     <span style={{ color: '#007bff',marginRight:'4px' }}>Updated at</span> {new Date(issueData.updatedAt).toLocaleString('en-GB')}
//                   </Typography>
//                 </Grid>
//                 <Grid item container justifyContent="flex-end">
//                   <Button className={styles.buttonCommon} variant="contained" color="primary" onClick={handleOpenModal}>
//                     Update
//                   </Button>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//           <Box flex={1.1} className={styles.commentSection}>
//             <Comment
//               comment={commentsData}
//               issueId={issueId}
//               fetchComments={fetchComments}
//             />
//           </Box>
//         </Box>
//       </Box>
//       <EditIssueModal
//         open={openModal}
//         handleClose={() => setOpenModal(false)}
//         category={issueData.category}
//         description={issueData.description}
//         developerID={issueData.developerID ? issueData.developerID._id : null}
//         priority={issueData.priority}
//         title={issueData.title}
//         ticketStatus={issueData.ticketStatus}
//         ticketID={issueData._id}
//         fetchIssueDetails={fetchIssueDetails}
//       />
//     </Box>
//   );
// }

// export default IssueDetails;

// .issueContainer {
//     margin: 40px 70px;
// }

// .issueBody {
//     display: flex;
//     flex-direction: column;
//     gap: 16px;
// }

// .buttonCommon {
//     background-color: #6b8e23 !important;
//     color: white !important;
//     border: none;
//     padding: 5px 18px;
//     text-align: center;
//     text-decoration: none;
//     display: inline-block;
//     font-size: 14px;
//     margin: 4px 2px;
//     cursor: pointer;
//     border-radius: 4px;
//     transition: background-color 0.3s;
// }

// .buttonCommon:hover {
//     background-color: #155a9e !important;
// }

// .commentSection {
//     margin-top: 16px;
// }

// .outerDiv {
//     display: flex;
//     flex-direction: column;
//     margin-bottom: 50px;
// }

// .issueImage {
//     width: 100%;
//     max-width: 200px;
//     /* Adjust as needed */
//     height: auto;
//     max-height: 200px;
//     /* Adjust as needed */
//     object-fit: cover;
//     border-radius: 4px;
//     /* Optional: Adds rounded corners */
//     /* margin-bottom: 10px; */
//     /* Optional: Adds space between images */
// }

// .imageGrid {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 0px;
//     /* margin-bottom: 32px; */
//     margin-left: 20px;
//     /* Adjust the gap as needed */
// }

// .imageContainer {
//     flex: 1 1 calc(25% - 16px);
//     /* Adjust the width to fit your needs, 25% for 4 columns layout */
//     max-width: calc(25% - 16px);
//     display: flex;
// }
