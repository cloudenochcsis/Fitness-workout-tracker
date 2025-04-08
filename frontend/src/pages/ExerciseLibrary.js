import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  TextField, 
  MenuItem, 
  InputAdornment,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExerciseCard from '../components/exercises/ExerciseCard';
import { fetchExercises } from '../services/api';

const muscleGroups = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Full Body'
];

const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getExercises = async () => {
      try {
        setLoading(true);
        const data = await fetchExercises();
        setExercises(data);
        setFilteredExercises(data);
        setError(null);
      } catch (err) {
        setError('Failed to load exercises. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getExercises();
  }, []);

  useEffect(() => {
    let result = exercises;
    
    // Filter by muscle group
    if (selectedMuscleGroup !== 'All') {
      result = result.filter(exercise => 
        exercise.muscleGroup === selectedMuscleGroup
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTermLower) ||
        (exercise.description && exercise.description.toLowerCase().includes(searchTermLower))
      );
    }
    
    setFilteredExercises(result);
  }, [searchTerm, selectedMuscleGroup, exercises]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMuscleGroupChange = (e) => {
    setSelectedMuscleGroup(e.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Exercise Library
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search exercises"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Muscle Group"
              value={selectedMuscleGroup}
              onChange={handleMuscleGroupChange}
            >
              {muscleGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredExercises.length === 0 ? (
        <Typography>
          No exercises found. Try adjusting your filters.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredExercises.map((exercise) => (
            <Grid item xs={12} sm={6} md={4} key={exercise.id}>
              <ExerciseCard exercise={exercise} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ExerciseLibrary;