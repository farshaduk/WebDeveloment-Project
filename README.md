
# social media platform 

A web application with a **React** frontend and a **Node.js/Express** backend for College Project.

## Table of Contents

1. [Overview](#overview)
2. [Technologies Used](#technologies-used)
3. [Setup Instructions](#setup-instructions)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
4. [Usage](#usage)
5. [Contributing](#contributing)


## Overview

This project includes:
- A **frontend** built with React to provide a responsive user interface.
- A **backend** implemented using Node.js and Express.js to manage APIs and server-side logic.

The application supports features like:
- User authentication.
- Post creation and management.
- Displaying posts and user suggestions.

## Technologies Used

- **Frontend**: React, Bootstrap, FontAwesome.
- **Backend**: Node.js, Express, MongoDB (for database).
- **API Testing**: Fetch API.
- **Styling**: Custom CSS.

## Setup Instructions

### Backend Setup

1. Navigate to the `api` directory:
2. Install dependencies:
 
   npm install

3. Create an `.env` file in the `api` directory and add the following variables:
   PORT=8081
   MONGO_URI=************
   JWT_SECRET=**********
   
4. Start the backend server:
   bash
   npm run dev
   

### Frontend Setup

1. Navigate to the `front-end` directory:
   cd front-end 

2. Install dependencies:
   npm install 

3. Create a `.env` file in the `front-end` directory and add the following variable:
 
   REACT_APP_API_URL=http://localhost:3000
  

4. Start the frontend development server:
   yarn start
   

## Usage
1. Visit `http://localhost:3000` in your browser for the frontend.


