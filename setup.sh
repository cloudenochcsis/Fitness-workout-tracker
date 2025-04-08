#!/bin/bash

# This script sets up the development environment for the Fitness Workout Tracker application

# Check for prerequisites
command -v python3 >/dev/null 2>&1 || { echo "Python 3 is required but not installed. Aborting." >&2; exit 1; }
command -v pip3 >/dev/null 2>&1 || { echo "pip3 is required but not installed. Aborting." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed. Aborting." >&2; exit 1; }

echo "Setting up Fitness Workout Tracker development environment..."

# Create Python virtual environment
echo "Creating Python virtual environment..."
cd backend
python3 -m venv venv
source venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
pip3 install -r requirements.txt

# Initialize the database
echo "Initializing the database..."
export FLASK_APP=run.py
export FLASK_ENV=development
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Add initial data (sample exercises)
python3 << EOF
from app import create_app, db
from app.models import Exercise

app = create_app('development')
with app.app_context():
    # Create sample exercises if none exist
    if Exercise.query.count() == 0:
        exercises = [
            Exercise(name='Push-ups', description='Basic upper body exercise', category='strength'),
            Exercise(name='Squats', description='Basic lower body exercise', category='strength'),
            Exercise(name='Running', description='Cardiovascular exercise', category='cardio'),
            Exercise(name='Plank', description='Core strengthening exercise', category='strength'),
            Exercise(name='Jumping Jacks', description='Full body cardio exercise', category='cardio'),
            Exercise(name='Yoga', description='Flexibility and balance exercise', category='flexibility')
        ]
        for exercise in exercises:
            db.session.add(exercise)
        db.session.commit()
        print("Added sample exercises to the database")
EOF

echo "Backend setup complete!"
deactivate  # Deactivate virtual environment

# Setup frontend
echo "Setting up frontend..."
cd ../frontend
npm install

echo "Setup complete!"
echo ""
echo "To start the backend server:"
echo "cd backend"
echo "source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "python run.py"
echo ""
echo "To start the frontend development server:"
echo "cd frontend"
echo "npm run dev"
echo ""
echo "To run the application with Docker:"
echo "docker-compose up -d"