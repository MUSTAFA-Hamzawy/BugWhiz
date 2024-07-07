


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from "./Projects.module.css";
import Header from '../Header/Header';
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

const Projects = ({ userState }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const projectsPerPage = 6;
  const navigate = useNavigate();

  const handleChange = (event, value) => {
    setPage(value);
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://51.20.81.93:80/api/project', {
        params: {
          page: page,
          limit: projectsPerPage
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const { projects, totalCount } = response.data;
      setProjects(projects);
      setTotalProjects(totalCount);

      if (projects.length === 0 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://51.20.81.93:80/api/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUserToProject = async (projectID, username) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.patch(`http://51.20.81.93:80/api/project/add_user`, {
        projectID,
        username
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('User added to project:', response.data);
      fetchProjects();
    } catch (error) {
      console.error('Error adding user to project:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, [page]);

  const handleEdit = (project) => {
    setEditingProjectId(project._id);
    setNewProjectName(project.projectName);
  };

  const handleCancel = () => {
    setEditingProjectId(null);
    setNewProjectName('');
  };

  const handleUpdateProject = async (projectID) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.patch(`http://51.20.81.93:80/api/project`, {
        projectID: projectID,
        projectName: newProjectName
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Project updated:', response.data);
      fetchProjects();
      setEditingProjectId(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://51.20.81.93:80/api/project`, {
        data: { projectID: deleteProjectId },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Project deleted');
      fetchProjects();
      setOpenDeleteModal(false);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleOpenDeleteModal = (projectID) => {
    setDeleteProjectId(projectID);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleViewIssues = (projectID, projectName) => {
    navigate('/issues', { state: { projectId: projectID, projectName: projectName } });
  };

  return (
    <>
      <HelmetComponent title="Projects - BugWhiz" description="Manage your projects" />
      <Header userState={userState} fetchProjects={fetchProjects} />
      <div className={styles.projectsContainer}>
        <div style={{ margin: '40px 70px 0px' }}>
          <span style={{ fontSize: '21px', fontFamily: 'sans-serif', fontWeight: 'bold', color: '#213351' }}>
            {projects.length === 0 ? (
              <span></span>
            ) : (<span>Projects</span>)}
          </span>
        </div>
        <div className={styles.projectList}>
          {projects.length === 0 ? (
            <Typography variant="h6" component="div" style={{ textAlign: 'center', marginTop: '20px' }}>
              No projects yet
            </Typography>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ color: '#213351' }}>Name</th>
                  <th style={{ color: '#213351' }}>Actions</th>
                  <th style={{ color: '#213351' }}>Add User to Project</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(projects) && projects.map((project, index) => (
                  <tr key={index}>
                    <td>
                      {editingProjectId === project._id ? (
                        <div className={styles.editingContainer}>
                          <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            className={styles.textField}
                          />
                          <button className={styles.okButton} onClick={() => handleUpdateProject(project._id)}>OK</button>
                          <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                        </div>
                      ) : (
                        <span className={styles.projectLink}>{project.projectName}</span>
                      )}
                    </td>
                    <td>
                      <button className={styles.updateButton} onClick={() => handleEdit(project)}>Update</button>
                      <button className={styles.deleteButton} onClick={() => handleOpenDeleteModal(project._id)}>Delete</button>
                      <button className={styles.viewIssuesButton} onClick={() => handleViewIssues(project._id, project.projectName)}>View Issues</button>
                    </td>
                    <td style={{display:'flex',alignItems:'center', gap:'20px'}}>
                      <select
                        className={styles.userDropdown}
                        onChange={(e) => handleAddUserToProject(project._id, e.target.value)}
                      >
                        <option value="">Select a user</option>
                        {users.map((user, idx) => (
                          <option key={idx} value={user.fullName}>{user.fullName}</option>
                        ))}
                      </select>
                      <button className={styles.okButton}>Add</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {projects.length > 0 && (
            <div className={styles.paginationContainer}>
              <Pagination
                count={Math.ceil(totalProjects / projectsPerPage)}
                page={page}
                onChange={handleChange}
                renderItem={(item) => (
                  <PaginationItem
                    components={{
                      previous: ArrowBackIcon,
                      next: ArrowForwardIcon,
                    }}
                    {...item}
                  />
                )}
              />
            </div>
          )}
        </div>
        <Modal
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="delete-modal-title" variant="h6" component="h2">
              Confirm Delete
            </Typography>
            <Typography id="delete-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to delete this project?
            </Typography>
            <Button onClick={handleDelete}>Delete</Button>
            <Button onClick={handleCloseDeleteModal}>Cancel</Button>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default Projects;

