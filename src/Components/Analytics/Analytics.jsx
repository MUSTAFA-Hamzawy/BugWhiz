import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Analytics.module.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const location = useLocation();
  const { projectId } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://51.20.81.93:80/api/project/analytics',{
          params: {
            projectID: projectId
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }); 
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const { totalTickets, ticketStatus, ticketPriority, ticketCategory, developers } = data;

  const statusData = [
    { name: 'Todo', value: ticketStatus.TODO, percentage: ((ticketStatus.TODO / totalTickets) * 100).toFixed(2) },
    { name: 'Progress', value: ticketStatus.progress, percentage: ((ticketStatus.progress / totalTickets) * 100).toFixed(2) },
    { name: 'Done', value: ticketStatus.done, percentage: ((ticketStatus.done / totalTickets) * 100).toFixed(2) },
  ];

  const priorityData = [
    { name: 'P1', value: ticketPriority.P1, percentage: ((ticketPriority.P1 / totalTickets) * 100).toFixed(2) },
    { name: 'P2', value: ticketPriority.P2, percentage: ((ticketPriority.P2 / totalTickets) * 100).toFixed(2) },
    { name: 'P3', value: ticketPriority.P3, percentage: ((ticketPriority.P3 / totalTickets) * 100).toFixed(2) },
    { name: 'P4', value: ticketPriority.P4, percentage: ((ticketPriority.P4 / totalTickets) * 100).toFixed(2) },
    { name: 'P5', value: ticketPriority.P5, percentage: ((ticketPriority.P5 / totalTickets) * 100).toFixed(2) },
  ];

  const categoryData = [
    { name: 'Frontend', value: ticketCategory.Frontend, percentage: ((ticketCategory.Frontend / totalTickets) * 100).toFixed(2) },
    { name: 'Backend', value: ticketCategory.Backend, percentage: ((ticketCategory.Backend / totalTickets) * 100).toFixed(2) },
    { name: 'Documentation', value: ticketCategory.Documentation, percentage: ((ticketCategory.Documentation / totalTickets) * 100).toFixed(2) },
    { name: 'Security', value: ticketCategory.Security, percentage: ((ticketCategory.Security / totalTickets) * 100).toFixed(2) },
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom className={styles.headerName}>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Ticket Status Histogram */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={styles.branchName}>Ticket Status</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        {/* Ticket Priority Histogram */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={styles.branchName}>Ticket Priority</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        {/* Ticket Category Histogram */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={styles.branchName}>Ticket Category</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        {/* Pie Charts */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={styles.branchName}>Ticket Status Distribution</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={statusData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                fill="#8884d8" 
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => `${props.payload.percentage}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={styles.branchName}>Ticket Priority Distribution</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={priorityData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                fill="#82ca9d" 
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => `${props.payload.percentage}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={styles.branchName}>Ticket Category Distribution</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={categoryData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                fill="#ffc658" 
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => `${props.payload.percentage}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        {/* Developer Histograms */}
        {developers.map((developer) => (
          <Grid item xs={12} md={6} key={developer._id}>
            <Typography variant="h6" className={styles.branchName}>{developer.fullName} - Ticket Breakdown</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Assigned', value: developer.ticketsAssigned },
                { name: 'Todo', value: developer.todo },
                { name: 'Progress', value: developer.progress },
                { name: 'Done', value: developer.done },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Analytics;

