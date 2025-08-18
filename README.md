# Blog-shop

A web application for shopping and blogging, built with **React, Vite, Tailwind, Node.js, Express, MongoDB**.

## Technologies
- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express
- Database: MongoDB
## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/thai2602/Blog-shop.git
2. Install dependencies for both frontend and backend:
   npm install
   
## Environment Variables
Create a `.env` file before running the project.  

### Backend (server/.env)
- `MONGODB_URI` → MongoDB connection string  
- `JWT_SECRET` → Secret key for signing JWT tokens  
- `PORT` → Port for the backend server (default: 5000)  

### Frontend (.env)
- `VITE_API_BASE` → API base URL (default: http://localhost:5000)

## Running the Project
- BE: node ./sever/src/index.js
- FE: npm run dev

## Project Structure
/sever

   /models
   
   /routes
   
   /db.js
   
   /index.js
   
/src

   /blog-create
   
   /components
   
   /pages
   
   /sub
   
   /users

 
