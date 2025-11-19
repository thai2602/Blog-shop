# Blog-shop

- The purpose of Blog-shop is to provide small shop owners with a dedicated platform to showcase their passion in a professional and organized way, rather than through scattered posts on social media. It also allows customers to better appreciate that dedication, thereby increasing trust and credibility 
- Web structure: https://mm.tt/map/3805660976?t=Dso4YpxEXG
- Short demo: https://www.youtube.com/watch?v=SdHdY6wO_-I
- Built with **React, Vite, Tailwind, Node.js, Express, MongoDB**.

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
```
blog-shop/
├── frontend/
│   └── src/
│       ├── components/      # Reusable components
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   └── ProductCard.jsx
│       ├── pages/          # Page components
│       │   ├── Home.jsx
│       │   ├── Shop.jsx
│       │   ├── Blog.jsx
│       │   ├── Albums.jsx
│       │   └── Contact.jsx
│       ├── users/          # User-related pages
│       │   ├── login.jsx
│       │   ├── register.jsx
│       │   └── userprofile.jsx
│       ├── create/         # Creation pages
│       │   ├── CreateBlogUi.jsx
│       │   ├── AddProducts.jsx
│       │   └── CreateShop.jsx
│       ├── lib/            # Utilities
│       │   ├── api.js
│       │   └── albumsApi.js
│       └── sub/            # Sub-components
│           └── Subnav.jsx
│
└── backend/
    └── server/
        └── src/
            ├── controllers/    # Request handlers
            ├── services/       # Business logic
            ├── models/         # Database schemas
            ├── routes/         # API routes
            ├── middlewares/    # Custom middleware
            ├── validators/     # Input validation
            ├── utils/          # Helper functions
            └── config/         # Configuration files

 
