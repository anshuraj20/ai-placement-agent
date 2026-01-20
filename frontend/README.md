# AI Placement Agent Frontend

This is the frontend for the AI Placement Agent project, built with React and Material-UI.

## Getting Started

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The app will run on http://localhost:3000 and proxy API requests to the backend on http://localhost:8000.

## Features

- Clean, designable UI with Material-UI components
- Modal popup for entering Domain and Level
- Displays preparation roadmap, daily plan, and mock questions from the backend

## Backend Connection

Ensure the backend is running on http://localhost:8000. The frontend uses a proxy to connect to the backend API.