import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Button,
  Paper,
  Box,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  DirectionsRun as DirectionsRunIcon,
  Today as TodayIcon,
  Timer as TimerIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { statsApi, workoutApi } from '../services/api';
import StatCard from '../components/stats/StatCard';
import WorkoutCard from '../components/workouts/WorkoutCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [summaryStats, setSummaryStats] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch summary stats and recent workouts in parallel
        const [statsResponse, workoutsResponse] = await Promise.all([
          statsApi.getSummary(),
          workoutApi.getWorkouts(1, 3)
        ]);
        
        setSummaryStats(statsResponse);
        setRecentWorkouts(workoutsResponse.workouts);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <Container className="dashboard-container">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  return (
    <Container className="dashboard-container">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome{user ? `, ${user.username}` : ''}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your fitness journey and achieve your goals.
        </Typography>
      </Box>
      
      {error ? (
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography>{error}</Typography>
        </Paper>
      ) : (
        <>
          {/* Stats Section */}
          {summaryStats && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Your Stats
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Total Workouts"
                    value={summaryStats.total_workouts}
                    icon={<FitnessCenterIcon fontSize="large" />}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="This Month"
                    value={summaryStats.workouts_last_30_days}
                    icon={<TodayIcon fontSize="large" />}
                    description="Workouts in the last 30 days"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Total Minutes"
                    value={summaryStats.total_duration_minutes || 0}
                    icon={<TimerIcon fontSize="large" />}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Favorite Exercise"
                    value={summaryStats.most_frequent_exercise || 'None yet'}
                    icon={<DirectionsRunIcon fontSize="large" />}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* Recent Workouts Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Recent Workouts
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to="/workouts/new"
                startIcon={<AddIcon />}
              >
                Add Workout
              </Button>
            </Box>
            
            {recentWorkouts.length > 0 ? (
              <Grid container spacing={3}>
                {recentWorkouts.map((workout) => (
                  <Grid item xs={12} sm={6} md={4} key={workout.id}>
                    <WorkoutCard workout={workout} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  You haven't logged any workouts yet.
                </Typography>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/workouts/new"
                  startIcon={<AddIcon />}
                >
                  Add Your First Workout
                </Button>
              </Paper>
            )}
            
            {recentWorkouts.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  component={RouterLink}
                  to="/workouts"
                  variant="outlined"
                >
                  View All Workouts
                </Button>
              </Box>
            )}
          </Box>
          
          {/* Quick Links */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Quick Links
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  component={RouterLink}
                  to="/exercises"
                  startIcon={<DirectionsRunIcon />}
                  sx={{ py: 1.5 }}
                >
                  Exercise Library
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  component={RouterLink}
                  to="/profile"
                  startIcon={<DirectionsRunIcon />}
                  sx={{ py: 1.5 }}
                >
                  Profile Settings
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
