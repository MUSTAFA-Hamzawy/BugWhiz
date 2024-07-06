import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from "./Issues.module.css";
import CreateIssueModal from './CreateIssueModal'; // import the modal component
import HelmetComponent from '../../HelmetComponent';

const modalStyle = {
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

// const getInitials = (name) => {
//   if (!name) return '';
//   const nameParts = name.split(' ');
//   return nameParts.map(part => part.charAt(0)).join('').toUpperCase();
// };

const Issues = () => {
  const location = useLocation();
  const { projectId, projectName } = location.state || {};

  const [modalOpen, setModalOpen] = useState(false); // modal state

  const [issues, setIssues] = useState([]);
  const [page, setPage] = useState(1);
  const [totalIssues, setTotalIssues] = useState(0);
  const [status, setStatus] = useState('None');
  const [priority, setPriority] = useState('None');
  const [category, setCategory] = useState('None');
  const [searchKeyword, setSearchKeyword] = useState('');
  const issuesPerPage = 5; // Set the number of issues per page
  const [deleteIssueId, setDeleteIssueId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  
  const navigate = useNavigate();

  const fetchIssues = async (search = false) => {
    try {
      const token = localStorage.getItem('authToken');
      if (search) {
        const response = await axios.get('http://51.20.81.93:80/api/ticket/search', {
          params: {
            projectID: projectId,
            page: page,
            limit: issuesPerPage,
            keyword: searchKeyword,
            ticketStatus: status,
            priority: priority,
            category: category
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }); 
        console.log(projectId, page, issuesPerPage, searchKeyword, status, priority, category);
        console.log(response.data);
        const { tickets, totalCount } = response.data;
        setIssues(tickets);
        setTotalIssues(totalCount);
  
        // Handle empty current page
        if (tickets.length === 0 && page > 1) {
          setPage(page - 1);
        }
      } else {
        const response = await axios.get('http://51.20.81.93:80/api/project/tickets', {
          params: {
            projectID: projectId,
            page: page,
            limit: issuesPerPage
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }); 
        const { tickets, totalCount } = response.data;
        setIssues(tickets);
        setTotalIssues(totalCount);

        // Handle empty current page
        if (tickets.length === 0 && page > 1) {
          setPage(page - 1);
        }
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchIssues();
    }
  }, [projectId, page, status, priority, category]);

  const handleViewIssueDetails = (issueID) => {
    navigate('/issueDetails', { state: { issueId: issueID} });
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://51.20.81.93:80/api/ticket`, {
        data: { ticketID: deleteIssueId },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Issue deleted');
      fetchIssues();
      setOpenDeleteModal(false);
    } catch (error) {
      console.error('Error deleting issue:', error);
    }
  };

  const handleOpenDeleteModal = (issueID) => {
    setDeleteIssueId(issueID);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleSearch = () => {
    setPage(1); // Reset to the first page for new search
    fetchIssues(true);
  };

  const handleViewAll = () => {
    setSearchKeyword('');
    setStatus('None');
    setPriority('None');
    setCategory('None');
    fetchIssues(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles.issuesContainer}>
      <HelmetComponent title="Issues - BugWhiz" description="Manage project issues" />
      <div style={{ margin: '40px 70px 0px 70px', display: 'flex', alignItems: 'center', gap: '80px' }}>
        <span style={{ fontSize: '17px', fontFamily: 'sans-serif', color: '#213351' }}>
          Projects / {projectName}
        </span>
        <button className={styles.buttonCommon} onClick={handleModalOpen}>Create Issue</button>
      </div>
      <div style={{ margin: '20px 70px 40px 70px', display: 'flex', alignItems: 'center', gap: '80px' }}>
        <span style={{ fontSize: '21px', fontFamily: 'sans-serif', fontWeight: 'bold', color: '#213351' }}>
          Issues
        </span>
      </div>
      <div className={styles.header}>
        <TextField
          className={styles.searchInput}
          variant="outlined"
          placeholder="Search Issues"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          sx={{
            width: '200px',
            '& .MuiOutlinedInput-root': {
              padding: '7px 5px',
              fontSize: '15px',
            },
            '& .MuiOutlinedInput-input': {
              padding: '0px 12px',
            },
            '& .MuiInputAdornment-root': {
              marginRight: '7px',
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Select
          value={status}
          onChange={handleStatusChange}
          displayEmpty
          className={styles.filterSelect}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="TODO">TODO</MenuItem>
          <MenuItem value="IN PROGRESS">IN PROGRESS</MenuItem>
          <MenuItem value="DONE">DONE</MenuItem>
        </Select>
        <Select
          value={priority}
          onChange={handlePriorityChange}
          displayEmpty
          className={styles.filterSelect}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="P1">P1</MenuItem>
          <MenuItem value="P2">P2</MenuItem>
          <MenuItem value="P3">P3</MenuItem>
          <MenuItem value="P4">P4</MenuItem>
          <MenuItem value="P5">P5</MenuItem>
        </Select>
        <Select
          value={category}
          onChange={handleCategoryChange}
          displayEmpty
          className={styles.filterSelect}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Frontend">Frontend</MenuItem>
          <MenuItem value="Backend">Backend</MenuItem>
          <MenuItem value="Security">Security</MenuItem>
          <MenuItem value="Documentation">Documentation</MenuItem>
        </Select>
        <Button onClick={handleSearch} className={styles.buttonCommon} sx={{ height: '36px', color: '#213351', textTransform: 'none', padding:'0 15px' }}>
          Search
        </Button>
        <Button onClick={handleViewAll} className={styles.buttonCommon} sx={{ height: '36px', color: '#213351', textTransform: 'none' }}>
          View All Issues
        </Button>
      </div>
      <div className={styles.issueList}>
        {issues.length === 0 ? (
          <Typography variant="h6" component="div" style={{ textAlign: 'center', marginTop: '20px' }}>
            {searchKeyword || status !== 'None' || priority !== 'None' || category !== 'None' ? 'No issues found' : 'No issues yet'}
          </Typography>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ color: '#213351' }}>Name</th>
                <th style={{ color: '#213351' }}>Title</th>
                <th style={{ color: '#213351' }}>Status</th>
                <th style={{ color: '#213351' }}>Priority</th>
                <th style={{ color: '#213351' }}>Category</th>
                <th style={{ color: '#213351' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, index) => (
                <tr key={index}>
                  <td>
                    <span onClick={() => handleViewIssueDetails(issue._id, issue.name)} className={styles.issueLink}>{issue.name}</span>
                  </td>
                  <td>
                    <span className={styles.issueText}>{issue.title}</span>
                  </td>
                  <td>
                    <span>{issue.ticketStatus}</span>
                  </td>
                  <td>
                    <span>{issue.priority}</span>
                  </td>
                  <td>
                    <span>{issue.category}</span>
                  </td>
                  <td>
                    <button
                      className={styles.buttonCommon}
                      onClick={() => handleViewIssueDetails(issue._id, issue.name)}
                    >
                      View Details
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleOpenDeleteModal(issue._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {issues.length !== 0 && (
        <div className={styles.paginationContainer}>
          <Pagination
            count={Math.ceil(totalIssues / issuesPerPage)}
            page={page}
            onChange={handleChange}
            renderItem={(item) => (
              <PaginationItem
                components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
                sx={{
                  minWidth: 36,
                  height: 36,
                  margin: '0 4px',
                  borderRadius: 4,
                  fontSize: 14,
                  color: '#1976d2',
                  border: '1px solid #d3e1ea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&.Mui-selected': {
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                  },
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  },
                }}
              />
            )}
          />
        </div>
      )}
      <CreateIssueModal open={modalOpen} handleClose={handleModalClose} projectId={projectId} fetchIssues={fetchIssues}/>
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="delete-modal-title" variant="h6" component="h2">
            Confirm Deletion
          </Typography>
          <Typography id="delete-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this issue?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button className={styles.okButton} onClick={handleDelete}>
              OK
            </Button>
            <Button className={styles.cancelButton} onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Issues;
