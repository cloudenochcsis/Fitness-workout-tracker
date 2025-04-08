# Contributing to Fitness Workout Tracker

Thank you for considering contributing to the Fitness Workout Tracker project! This document provides guidelines and instructions for contributing.

## Development Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/fitness-workout-tracker.git
   cd fitness-workout-tracker
   ```

2. Run the setup script to initialize the development environment:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. Alternatively, you can set up the environment manually:

   **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   
   # Initialize database
   export FLASK_APP=run.py
   export FLASK_ENV=development
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   
   # Run the server
   python run.py
   ```

   **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Development Workflow

1. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes and commit them with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: description of the feature"
   # or
   git commit -m "Fix: description of the bug fix"
   ```

3. Push your branch to the repository:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request (PR) from your branch to the main branch.

## Coding Standards

### Backend (Python/Flask)

- Follow PEP 8 style guide for Python code
- Use descriptive variable and function names
- Write docstrings for classes and functions
- Include type hints where appropriate
- Write unit tests for new functionality

### Frontend (React)

- Follow the ESLint and Prettier configuration
- Use functional components with hooks instead of class components
- Use proper TypeScript types/interfaces
- Group imports (React, third-party, local)
- Write tests for new components

## Testing

### Backend Tests

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Docker Development

You can use Docker Compose to run the entire application:

```bash
docker-compose up -d
```

This will build and start both the frontend and backend services.

## Azure DevOps CI/CD Pipeline

The project uses Azure DevOps Pipelines for CI/CD. Each push to a branch will trigger:

1. Linting and style checks
2. Unit tests
3. Build Docker images
4. Push to Azure Container Registry (on main branch)

Pull requests to the main branch require passing CI checks and code review.

## Azure Deployment

To deploy manually to Azure:

```bash
# Make sure you're logged into Azure CLI
az login

# Run the deployment script
./deploy-to-azure.sh
```

To set up the initial Azure resources:

```bash
# Run the environment setup script
./azure-pipelines/environment-setup.sh
```

## Database Migrations

When making changes to database models:

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
export FLASK_APP=run.py
flask db migrate -m "Description of changes"
flask db upgrade
```

## Documentation

- Update the README.md file with any new features or changes to setup instructions
- Document API endpoints and parameters
- Comment complex code sections

## Questions?

If you have any questions about contributing, please open an issue in the repository or contact the project maintainers.