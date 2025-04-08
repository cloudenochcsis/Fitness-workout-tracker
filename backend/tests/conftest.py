import pytest
import os
from app import create_app, db
from app.models import User, Exercise, Workout, WorkoutExercise

@pytest.fixture
def app():
    app = create_app('testing')
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

@pytest.fixture
def init_database(app):
    with app.app_context():
        # Create test user
        user = User(username='testuser', email='test@example.com', password='password')
        db.session.add(user)
        
        # Create test exercises
        exercises = [
            Exercise(name='Push-ups', description='Basic upper body exercise', category='strength'),
            Exercise(name='Running', description='Cardio exercise', category='cardio'),
            Exercise(name='Squats', description='Lower body exercise', category='strength')
        ]
        for exercise in exercises:
            db.session.add(exercise)
        
        db.session.commit()
        
        # Create test workout
        workout = Workout(
            user_id=user.id,
            name='Test Workout',
            duration=30,
            notes='This is a test workout'
        )
        db.session.add(workout)
        db.session.commit()
        
        # Add exercises to workout
        workout_exercises = [
            WorkoutExercise(
                workout_id=workout.id,
                exercise_id=exercises[0].id,
                sets=3,
                reps=10
            ),
            WorkoutExercise(
                workout_id=workout.id,
                exercise_id=exercises[1].id,
                duration=600  # 10 minutes in seconds
            )
        ]
        for we in workout_exercises:
            db.session.add(we)
        
        db.session.commit()
        
        yield db

@pytest.fixture
def auth_headers(app, client, init_database):
    response = client.post('/auth/login', json={
        'username': 'testuser',
        'password': 'password'
    })
    token = response.json['access_token']
    return {'Authorization': f'Bearer {token}'}
