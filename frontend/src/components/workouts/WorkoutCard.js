import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Timer as TimerIcon,
  DateRange as DateIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const WorkoutCard = ({ workout, onDelete }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {workout.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <DateIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {format(new Date(workout.date), 'MMMM d, yyyy')}
          </Typography>
        </Box>
        
        {workout.duration && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TimerIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {workout.duration} minutes
            </Typography>
          </Box>
        )}
        
        {workout.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {workout.notes}
          </Typography>
        )}
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          component={RouterLink} 
          to={`/workouts/${workout.id}`}
        >
          View Details
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton 
          size="small" 
          component={RouterLink} 
          to={`/workouts/edit/${workout.id}`}
          aria-label="edit"
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          onClick={() => onDelete(workout.id)}
          aria-label="delete"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default WorkoutCard;
