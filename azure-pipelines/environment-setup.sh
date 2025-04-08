#!/bin/bash

# This script sets up the required Azure resources for the Fitness Workout Tracker application
# Make sure to have Azure CLI installed and be logged in before running this script

# Variables
RG_NAME="fitness-tracker-rg"
LOCATION="eastus"
ACR_NAME="fitnesstrackeracr"
BACKEND_APP_NAME="fitness-tracker-backend"
FRONTEND_APP_NAME="fitness-tracker-frontend"
APP_SERVICE_PLAN="fitness-tracker-app-service-plan"
SKU="B1"

# Create resource group
echo "Creating resource group..."
az group create --name $RG_NAME --location $LOCATION

# Create container registry
echo "Creating container registry..."
az acr create --resource-group $RG_NAME --name $ACR_NAME --sku Basic

# Enable admin credentials for the registry
az acr update --name $ACR_NAME --admin-enabled true

# Get the registry credentials
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

# Create app service plan
echo "Creating app service plan..."
az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RG_NAME --is-linux --sku $SKU

# Create web app for backend
echo "Creating backend web app..."
az webapp create --resource-group $RG_NAME --plan $APP_SERVICE_PLAN --name $BACKEND_APP_NAME --deployment-container-image-name "mcr.microsoft.com/appsvc/python:3.9"

# Configure backend app
az webapp config appsettings set --resource-group $RG_NAME --name $BACKEND_APP_NAME --settings \
  FLASK_ENV="production" \
  SECRET_KEY="change-this-in-production" \
  JWT_SECRET_KEY="change-this-in-production" \
  WEBSITES_PORT=5000

# Create web app for frontend
echo "Creating frontend web app..."
az webapp create --resource-group $RG_NAME --plan $APP_SERVICE_PLAN --name $FRONTEND_APP_NAME --deployment-container-image-name "nginx:alpine"

# Configure frontend app to use container registry
az webapp config container set --name $BACKEND_APP_NAME --resource-group $RG_NAME \
  --docker-custom-image-name "$ACR_NAME.azurecr.io/fitness-tracker-backend:latest" \
  --docker-registry-server-url "https://$ACR_NAME.azurecr.io" \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD

az webapp config container set --name $FRONTEND_APP_NAME --resource-group $RG_NAME \
  --docker-custom-image-name "$ACR_NAME.azurecr.io/fitness-tracker-frontend:latest" \
  --docker-registry-server-url "https://$ACR_NAME.azurecr.io" \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD

# Configure CORS for backend
az webapp cors add --resource-group $RG_NAME --name $BACKEND_APP_NAME --allowed-origins "https://$FRONTEND_APP_NAME.azurewebsites.net"

echo "Setup complete!"
echo "Backend URL: https://$BACKEND_APP_NAME.azurewebsites.net"
echo "Frontend URL: https://$FRONTEND_APP_NAME.azurewebsites.net"
