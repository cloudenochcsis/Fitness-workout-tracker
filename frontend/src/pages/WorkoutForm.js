import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { 
  createWorkout, 
  fetchWorkoutById, 
  updateWorkout,
  fetchExercises
} from '../services/api';

const defaultExerciseValues = {
  name: '',
  description: '',
  sets: 3,
  reps: 10,
  weight: '',
  weightUnit: 'kg',
  notes: ''
};

const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const WorkoutForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    difficulty: 'Beginner',
    duration: 30,
    tags: [],
    exercises: []
  });
  
  const [availableExercises, setAvailableExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(defaultExerciseValues);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    const fetchAvailableExercises = async () => {
      try {
        const data = await fetchExercises();
        setAvailableExercises(data);
      } catch (err) {
        console.error('Failed to load exercises', err);
      }
    };

    const fetchWorkoutData = async () => {
      if (isEditMode) {
        try {
          setInitialLoading(true);
          const data = await fetchWorkoutById(id);
          setFormValues(data);
        } catch (err) {
          setError('Failed to load workout. Please try again later.');
          console.error(err);
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchAvailableExercises();
    fetchWorkoutData();
  }, [id, isEditMode]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleCurrentExerciseChange = (e) => {
    const { name, value } = e.target;
    setCurrentExercise({
      ...currentExercise,
      [name]: value
    });
  };

  const handleExerciseSelect = (e) => {
    const selectedExerciseName = e.target.value;
    if (selectedExerciseName) {
      const selectedExercise = availableExercises.find(
        exercise => exercise.name === selectedExerciseName
      );
      
      if (selectedExercise) {
        setCurrentExercise({
          ...defaultExerciseValues,
          name: selectedExercise.name,
          description: selectedExercise.description || ''
        });
      }
    }
  };

  const addExercise = () => {
    if (!currentExercise.name) return;
    
    setFormValues({
      ...formValues,
      exercises: [...formValues.exercises, { ...currentExercise }]
    });
    
    setCurrentExercise(defaultExerciseValues);
  };

  const removeExercise = (index) => {
    const updatedExercises = formValues.exercises.filter((_, i) => i !== index);
    setFormValues({
      ...formValues,
      exercises: updatedExercises
    });
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (!formValues.tags.includes(tagInput.trim())) {
      setFormValues({
        ...formValues,
        tags: [...formValues.tags, tagInput.trim()]
      });
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove) => {
    setFormValues({
      ...formValues,
      tags: formValues.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await updateWorkout(id, formValues);
      } else {
        await createWorkout(formValues);
      }
      navigate('/workouts');
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} workout. Please try again later.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading workout data...</Typography>
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

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          {isEditMode ? 'Edit Workout' : 'Create New Workout'}
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Workout Name"
                name="name"
                value={formValues.name}
                onChange={handleFormChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formValues.description}
                onChange={handleFormChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Difficulty"
                name="difficulty"
                value={formValues.difficulty}
                onChange={handleFormChange}
              >
                {difficultyLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                name="duration"
                value={formValues.duration}
                onChange={handleFormChange}
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Tag"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={addTag}
                  sx={{ ml: 1 }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formValues.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" component="h2" sx={{ mb: 2, mt: 2 }}>
                Exercises
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Select Exercise"
                      onChange={handleExerciseSelect}
                      value=""
                    >
                      <MenuItem value="">
                        <em>Choose an exercise</em>
                      </MenuItem>
                      {availableExercises.map((exercise) => (
                        <MenuItem key={exercise.id} value={exercise.name}>
                          {exercise.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Exercise Name"
                    name="name"
                    value={currentExercise.name}
                    onChange={handleCurrentExerciseChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={currentExercise.description}
                    onChange={handleCurrentExerciseChange}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Sets"
                    name="sets"
                    value={currentExercise.sets}
                    onChange={handleCurrentExerciseChange}
                    InputProps={{
                      inputProps: { min: 1 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Reps"
                    name="reps"
                    value={currentExercise.reps}
                    onChange={handleCurrentExerciseChange}
                    InputProps={{
                      inputProps: { min: 1 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Weight"
                    name="weight"
                    value={currentExercise.weight}
                    onChange={handleCurrentExerciseChange}
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    select
                    label="Unit"
                    name="weightUnit"
                    value={currentExercise.weightUnit}
                    onChange={handleCurrentExerciseChange}
                  >
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="lb">lb</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    value={currentExercise.notes}
                    onChange={handleCurrentExerciseChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={addExercise}
                    disabled={!currentExercise.name}
                    startIcon={<AddIcon />}
                  >
                    Add Exercise
                  </Button>
                </Grid>
              </Grid>

              <List>
                {formValues.exercises.map((exercise, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" onClick={() => removeExercise(index)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={exercise.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {exercise.sets} sets × {exercise.reps} reps
                              {exercise.weight && ` at ${exercise.weight} ${exercise.weightUnit}`}
                            </Typography>
                            {exercise.description && (
                              <Typography component="p" variant="body2">
                                {exercise.description}
                              </Typography>
                            )}
                            {exercise.notes && (
                              <Typography component="p" variant="body2">
                                Note: {exercise.notes}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    {index < formValues.exercises.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mr: 2 }}
              >
                {isEditMode ? 'Update Workout' : 'Create Workout'}
              </Button>
              <Button
                component={Link}
                to="/workouts"
                variant="outlined"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default WorkoutForm;