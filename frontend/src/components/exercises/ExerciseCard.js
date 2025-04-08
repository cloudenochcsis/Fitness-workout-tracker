import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  FitnessCenter as FitnessCenterIcon,
} from '@mui/icons-material';

const ExerciseCard = ({ exercise, onSelect, onEdit, onDelete, selectable = false }) => {
  // Category colors
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'strength':
        return 'primary';
      case 'cardio':
        return 'secondary';
      case 'flexibility':
        return 'success';
      case 'balance':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {exercise.name}
          </Typography>
          {exercise.category && (
            <Chip 
              size="small" 
              color={getCategoryColor(exercise.category)} 
              label={exercise.category} 
              icon={<FitnessCenterIcon />}
            />
          )}
        </Box>
        
        {exercise.description && (
          <Typography variant="body2" color="text.secondary">
            {exercise.description}
          </Typography>
        )}
      </CardContent>
      
      <CardActions>
        {selectable && (
          <Button 
            size="small" 
            onClick={() => onSelect(exercise)}
          >
            Select
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {onEdit && (
          <IconButton 
            size="small" 
            onClick={() => onEdit(exercise)}
            aria-label="edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
        {onDelete && (
          <IconButton 
            size="small" 
            onClick={() => onDelete(exercise.id)}
            aria-label="delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export default ExerciseCard;
