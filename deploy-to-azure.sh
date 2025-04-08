#!/bin/bash

# This script deploys the Fitness Workout Tracker application to Azure App Service
# Prerequisites:
# - Azure CLI installed and logged in
# - Azure Container Registry (ACR) created
# - Azure App Service plan and Web Apps created

# Configuration variables
RG_NAME="fitness-tracker-rg"
ACR_NAME="fitnesstrackeracr"
BACKEND_APP_NAME="fitness-tracker-backend"
FRONTEND_APP_NAME="fitness-tracker-frontend"

echo "Deploying Fitness Workout Tracker to Azure..."

# Login to Azure Container Registry
echo "Logging in to Azure Container Registry..."
az acr login --name $ACR_NAME

# Build and push backend image
echo "Building and pushing backend image..."
docker build -t $ACR_NAME.azurecr.io/fitness-tracker-backend:latest -f Dockerfile.backend .
docker push $ACR_NAME.azurecr.io/fitness-tracker-backend:latest

# Build and push frontend image
echo "Building and pushing frontend image..."
docker build -t $ACR_NAME.azurecr.io/fitness-tracker-frontend:latest -f Dockerfile.frontend .
docker push $ACR_NAME.azurecr.io/fitness-tracker-frontend:latest

# Update backend web app to use the new image
echo "Updating backend web app..."
az webapp config container set --name $BACKEND_APP_NAME --resource-group $RG_NAME \
  --docker-custom-image-name "$ACR_NAME.azurecr.io/fitness-tracker-backend:latest" \
  --docker-registry-server-url "https://$ACR_NAME.azurecr.io"

# Update frontend web app to use the new image
echo "Updating frontend web app..."
az webapp config container set --name $FRONTEND_APP_NAME --resource-group $RG_NAME \
  --docker-custom-image-name "$ACR_NAME.azurecr.io/fitness-tracker-frontend:latest" \
  --docker-registry-server-url "https://$ACR_NAME.azurecr.io"

# Restart the web apps to apply changes
echo "Restarting web apps..."
az webapp restart --name $BACKEND_APP_NAME --resource-group $RG_NAME
az webapp restart --name $FRONTEND_APP_NAME --resource-group $RG_NAME

echo "Deployment complete!"
echo "Backend URL: https://$BACKEND_APP_NAME.azurewebsites.net"
echo "Frontend URL: https://$FRONTEND_APP_NAME.azurewebsites.net"