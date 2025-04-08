import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import WorkoutCard from '../components/workouts/WorkoutCard';
import { fetchUserWorkouts } from '../services/api';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWorkouts = async () => {
      try {
        setLoading(true);
        const data = await fetchUserWorkouts();
        setWorkouts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load workouts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getWorkouts();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Workouts
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/workouts/new"
        >
          Create New Workout
        </Button>
      </Box>

      {loading && <Typography>Loading workouts...</Typography>}
      
      {error && <Typography color="error">{error}</Typography>}
      
      {!loading && !error && workouts.length === 0 && (
        <Typography>
          You haven't created any workouts yet. Click "Create New Workout" to get started.
        </Typography>
      )}

      <Grid container spacing={3}>
        {workouts.map((workout) => (
          <Grid item xs={12} sm={6} md={4} key={workout.id}>
            <WorkoutCard workout={workout} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default WorkoutList;