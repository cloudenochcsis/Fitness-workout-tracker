import json
import pytest
from app import db
from app.models import Exercise, Workout, WorkoutExercise

def test_get_exercises(client, auth_headers, init_database):
    response = client.get('/api/exercises', headers=auth_headers)
    
    assert response.status_code == 200
    assert len(response.json['exercises']) == 3
    assert response.json['exercises'][0]['name'] in ['Push-ups', 'Running', 'Squats']

def test_get_exercise(client, auth_headers, init_database):
    # Get first exercise
    exercise = Exercise.query.first()
    
    response = client.get(f'/api/exercises/{exercise.id}', headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['name'] == exercise.name
    assert response.json['description'] == exercise.description

def test_create_exercise(client, auth_headers, init_database):
    response = client.post('/api/exercises', json={
        'name': 'Pull-ups',
        'description': 'Upper body exercise focusing on back muscles',
        'category': 'strength'
    }, headers=auth_headers)
    
    assert response.status_code == 201
    assert response.json['name'] == 'Pull-ups'
    
    # Check if exercise was added to database
    exercise = Exercise.query.filter_by(name='Pull-ups').first()
    assert exercise is not None
    assert exercise.description == 'Upper body exercise focusing on back muscles'
    assert exercise.category == 'strength'

def test_update_exercise(client, auth_headers, init_database):
    # Get first exercise
    exercise = Exercise.query.first()
    
    response = client.put(f'/api/exercises/{exercise.id}', json={
        'name': 'Modified Exercise',
        'description': 'Updated description',
        'category': 'flexibility'
    }, headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['name'] == 'Modified Exercise'
    
    # Check if exercise was updated in database
    updated_exercise = Exercise.query.get(exercise.id)
    assert updated_exercise.name == 'Modified Exercise'
    assert updated_exercise.description == 'Updated description'
    assert updated_exercise.category == 'flexibility'

def test_get_workouts(client, auth_headers, init_database):
    response = client.get('/api/workouts', headers=auth_headers)
    
    assert response.status_code == 200
    assert len(response.json['workouts']) == 1
    assert response.json['workouts'][0]['name'] == 'Test Workout'

def test_get_workout(client, auth_headers, init_database):
    # Get first workout
    workout = Workout.query.first()
    
    response = client.get(f'/api/workouts/{workout.id}', headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['name'] == workout.name
    assert response.json['duration'] == workout.duration
    assert 'exercises' in response.json

def test_create_workout(client, auth_headers, init_database):
    response = client.post('/api/workouts', json={
        'name': 'New Workout',
        'duration': 45,
        'notes': 'Testing workout creation'
    }, headers=auth_headers)
    
    assert response.status_code == 201
    assert response.json['name'] == 'New Workout'
    
    # Check if workout was added to database
    workout = Workout.query.filter_by(name='New Workout').first()
    assert workout is not None
    assert workout.duration == 45
    assert workout.notes == 'Testing workout creation'

def test_update_workout(client, auth_headers, init_database):
    # Get first workout
    workout = Workout.query.first()
    
    response = client.put(f'/api/workouts/{workout.id}', json={
        'name': 'Updated Workout',
        'duration': 60,
        'notes': 'Updated workout notes'
    }, headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['name'] == 'Updated Workout'
    
    # Check if workout was updated in database
    updated_workout = Workout.query.get(workout.id)
    assert updated_workout.name == 'Updated Workout'
    assert updated_workout.duration == 60
    assert updated_workout.notes == 'Updated workout notes'

def test_add_exercise_to_workout(client, auth_headers, init_database):
    workout = Workout.query.first()
    exercise = Exercise.query.filter_by(name='Squats').first()
    
    response = client.post(f'/api/workouts/{workout.id}/exercises', json={
        'exercise_id': exercise.id,
        'sets': 4,
        'reps': 12,
        'notes': 'Testing adding exercise to workout'
    }, headers=auth_headers)
    
    assert response.status_code == 201
    assert response.json['exercise_id'] == exercise.id
    assert response.json['sets'] == 4
    assert response.json['reps'] == 12
    
    # Check if exercise was added to workout in database
    workout_exercise = WorkoutExercise.query.filter_by(
        workout_id=workout.id, 
        exercise_id=exercise.id
    ).first()
    
    assert workout_exercise is not None
    assert workout_exercise.sets == 4
    assert workout_exercise.reps == 12