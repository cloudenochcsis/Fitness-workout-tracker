import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { fetchWorkoutById, deleteWorkout } from '../services/api';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const getWorkout = async () => {
      try {
        setLoading(true);
        const data = await fetchWorkoutById(id);
        setWorkout(data);
        setError(null);
      } catch (err) {
        setError('Failed to load workout details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getWorkout();
  }, [id]);

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteWorkout(id);
      navigate('/workouts');
    } catch (err) {
      console.error(err);
      setError('Failed to delete workout. Please try again later.');
    }
    setOpenDialog(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading workout details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button component={Link} to="/workouts" sx={{ mt: 2 }}>
          Back to Workouts
        </Button>
      </Container>
    );
  }

  if (!workout) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Workout not found</Typography>
        <Button component={Link} to="/workouts" sx={{ mt: 2 }}>
          Back to Workouts
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button component={Link} to="/workouts">
          Back to Workouts
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {workout.name}
          </Typography>
          <Box>
            <Button 
              variant="outlined" 
              color="primary" 
              component={Link} 
              to={`/workouts/edit/${id}`}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {workout.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip label={`Difficulty: ${workout.difficulty}`} sx={{ mr: 1 }} />
          <Chip label={`Duration: ${workout.duration} min`} sx={{ mr: 1 }} />
          {workout.tags?.map((tag) => (
            <Chip key={tag} label={tag} variant="outlined" sx={{ mr: 1 }} />
          ))}
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Exercises
        </Typography>
        
        {workout.exercises?.length === 0 ? (
          <Typography>No exercises in this workout.</Typography>
        ) : (
          <List>
            {workout.exercises?.map((exercise, index) => (
              <ListItem key={index} sx={{ border: 1, borderColor: 'divider', mb: 2, borderRadius: 1 }}>
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <ListItemText 
                      primary={exercise.name} 
                      secondary={exercise.description}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      {exercise.sets} sets × {exercise.reps} reps
                      {exercise.weight && ` at ${exercise.weight} ${exercise.weightUnit}`}
                    </Typography>
                    {exercise.notes && (
                      <Typography variant="body2" color="text.secondary">
                        Note: {exercise.notes}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Workout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this workout? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorkoutDetail;