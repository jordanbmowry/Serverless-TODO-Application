# Serverless TODO Application

## Live Demo

[Serverless TODO App](https://magnificent-eclair-0c01b7.netlify.app/)

This project is part of the **Udacity Cloud Developer Nanodegree** program. It was completed in collaboration with Udacity, using starter code provided by the course. The project demonstrates the implementation of a simple TODO application using AWS Lambda and the Serverless framework.

## Project Overview

The Serverless TODO application allows users to create, update, delete, and retrieve TODO items. Each item can optionally have an attachment image. The application ensures that users can only access their own TODO items, with user identity managed through JWT tokens.

### Key Features

- **Create TODO**: Add new TODO items with a name and due date.
- **Update TODO**: Modify existing TODO items, including marking them as done.
- **Delete TODO**: Remove TODO items.
- **Get TODOs**: Retrieve a list of all TODO items for the current user.
- **Upload Attachments**: Upload images as attachments to TODO items.

### AWS Services Used

- **AWS Lambda**: Backend logic is implemented as Lambda functions.
- **API Gateway**: Exposes RESTful endpoints for the frontend to interact with the backend.
- **DynamoDB**: Stores TODO items and their metadata.
- **S3**: Stores attachment images for TODO items.
- **IAM**: Manages access control for resources.
- **CloudFormation**: Deploys and manages the infrastructure as code.

## Project Structure

```
.
├── README.md
├── backend
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── serverless.yml
│   ├── src
│   └── tsconfig.json
└── client
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── public
    ├── src
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

## Prerequisites

- Node.js: Required to run the backend and frontend locally.
- Serverless Framework: Used for deploying the backend to AWS.
- AWS CLI: To interact with AWS services.
- Auth0 Account: For managing user authentication.

## Installation Instructions

### Backend

```
cd backend

npm install

serverless deploy
```

### Frontend

```
cd client

npm install

npm run dev
```

## Configuration

- Backend: Add your environment variables in the serverless.yml file, including your DynamoDB table name, S3 bucket name, and Auth0 domain and client ID.

```
environment:
    TODOS_TABLE: Todos-${self:provider.stage}
    TODOS_CREATED_AT_INDEX: TodosCreatedAtIndex
    IMAGES_S3_BUCKET: serverless-todo-app-images-${self:provider.stage}
    SIGNED_URL_EXPIRATION: 300
    AUTH_0_JWKS_URL: https://test-endpoint.auth0.com/.well-known/jwks.json
```

- Frontend: Create a .env file in the client directory with the following variables:

```
VITE_API_ENDPOINT=<your_api_endpoint>
VITE_AUTH0_DOMAIN=<your_auth0_domain>
VITE_AUTH0_CLIENT_ID=<your_auth0_client_id>
VITE_AUTH0_AUDIENCE=<your_auth0_audience>
```

## Usage

### Running Locally:

- Start both the frontend and backend locally to test the application before deploying it.
- Use npm run dev for the frontend and serverless offline for the backend.

### Deployment:

- Deploy the backend using serverless deploy.
- Deploy the frontend using a service like Netlify, Vercel, or AWS Amplify.

## API Endpoints

The application exposes the following API endpoints:

- **Authentication**
  - `POST - /auth`
  - `GET - /auth`
- **TODOs**
  - `GET - /todos`
  - `POST - /todos`
  - `PATCH - /todos/{todoId}`
  - `DELETE - /todos/{todoId}`
  - `POST - /todos/{todoId}/attachment`

### Authorization

A Bearer Token is required to access these routes. Example:

```http
Authorization: Bearer eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9kZXYtNTFmNWxrbHV1MGt5dWIyeS51cy5hdXRoMC5jb20vIn0..suJoTVSryhLpHZpt.BSqoDPciedfA_Hl861MdjAU_15dwCJM55qv3lMD06xNpDn8pJq0NyH7_CceMVHBjPfhFFT2p9HEN1eJTaD3JOpDNIDZS51CdS3l6ddJWpwfMIPd_PYM7oc1CsqsPcp9b8PICD6S406YS8VDEpzdHRPhQ5pkMGCvfNn35Bv0NkokQJVlluDxsXp79lH9lu5WoMvOl2ueWJR-bfz5iCcR2EwqJhkaf97fhYyMyXFm-ecrNXBEnAp978HXKyF4W8087e5h3mVej2oI1DyIIw7DLSVoilqANiMc4FVOKsOr0bXPUXSSxRmk3u9ehH71HWfPEisacnqYzTkZaU7GWlR4GRohGz8jDsVs.tZ5tY2P9bsN4Rqan4VML8g
```

## Example JSON Payloads

- `POST - /todos`

```
{
    "name": "clean toilet",
    "dueDate": "2024-12-12"
}
```

- `PATCH - /todos`

```
{
    "name": "clean toilet",
    "dueDate": "2024-12-12",
    "done": true
}
```
