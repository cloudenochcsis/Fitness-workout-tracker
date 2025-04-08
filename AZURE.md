# Azure Deployment Guide

This document provides detailed information about setting up and deploying the Fitness Workout Tracker application on Azure.

## Prerequisites

- Azure account with active subscription
- Azure CLI installed and configured
- Docker installed locally
- Git repository for your code

## Azure Resources

The application requires the following Azure resources:

1. **Azure Container Registry (ACR)** - for storing Docker images
2. **Azure App Service Plan** - for hosting the applications
3. **Azure App Service for Backend** - for running the Flask backend
4. **Azure App Service for Frontend** - for running the React frontend

## Initial Setup

You can set up all required resources using the provided script:

```bash
# Make the script executable
chmod +x azure-pipelines/environment-setup.sh

# Run the script
./azure-pipelines/environment-setup.sh
```

This script will:
- Create a resource group
- Create an Azure Container Registry
- Create an App Service Plan
- Create App Services for the backend and frontend
- Configure the App Services to use the container registry

## Manual Deployment

For manual deployment:

```bash
# Make the script executable
chmod +x deploy-to-azure.sh

# Run the script
./deploy-to-azure.sh
```

This script will:
- Build Docker images for backend and frontend
- Push the images to Azure Container Registry
- Configure the App Services to use the new images
- Restart the App Services

## Azure DevOps Pipeline Setup

1. **Create a new pipeline in Azure DevOps**
   - Navigate to Pipelines in your Azure DevOps project
   - Create a new pipeline
   - Choose "Azure Repos Git" (or your git provider)
   - Select your repository
   - Choose "Existing Azure Pipelines YAML file"
   - Select `/azure-pipelines/azure-pipelines.yml`

2. **Configure Service Connections**
   - In Azure DevOps Project Settings, create a new service connection to Azure Resource Manager
   - Create a new service connection to your Azure Container Registry

3. **Update Pipeline Variables**
   - Edit the pipeline
   - Update the variables section with your service connection names and registry URL

## Environment Configuration

### Environment Variables

The backend application uses the following environment variables:

- `FLASK_ENV`: Set to 'development' or 'production'
- `SECRET_KEY`: Secret key for Flask application
- `JWT_SECRET_KEY`: Secret key for JWT token generation

You can configure these in the Azure portal:
1. Go to your backend App Service
2. Navigate to Configuration > Application settings
3. Add each environment variable as a new application setting

### Database Configuration

The application uses SQLite by default. For a production environment, you might want to:

1. Set up an Azure SQL Database
2. Update the backend configuration to use the SQL Database
3. Add the database connection string to the App Service configuration

## Monitoring and Logs

### Application Insights

1. Create an Application Insights resource in Azure
2. Link it to your App Services
3. View telemetry data in the Azure portal

### Log Streaming

To view real-time logs:
```bash
az webapp log tail --name fitness-tracker-backend --resource-group fitness-tracker-rg
```

## Scaling

### Manual Scaling

1. Go to your App Service Plan
2. Navigate to Scale up (App Service plan)
3. Select a larger pricing tier

### Auto Scaling

1. Go to your App Service Plan
2. Navigate to Scale out (App Service plan)
3. Enable autoscale
4. Configure scaling rules based on metrics

## Security Considerations

1. **Secure Environment Variables** - Store sensitive information in Azure Key Vault
2. **CORS Configuration** - Limit cross-origin requests to trusted domains
3. **TLS/SSL** - Enable HTTPS for all App Services
4. **Authentication** - Consider adding Azure AD authentication for additional security

## Troubleshooting

- **Container Issues**: Check the container logs in the Azure portal
- **Deployment Failures**: Check the deployment logs in Azure DevOps
- **Application Errors**: Check Application Insights for exceptions and failures