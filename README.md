# HireMe Admin Panel

A professional admin panel built with React Admin for managing the HireMe job posting platform.

## Features

### 🎯 Dashboard

- Real-time statistics for job posts, applications, and queue
- Quick overview of system metrics
- Beautiful Material-UI design

### 📋 Job Posts Management

- View all job posts with filtering and search
- Create, edit, and delete job posts
- View detailed job post information including questions and screening responses
- Export job posts data

### 👥 Applicants Management

- View all applications across all job posts
- Filter by status (pending, in_queue, reviewed, shortlisted, rejected, hired)
- View applicant profiles with avatars
- See application ratings and screening responses
- View answers to questions

- Add notes to queue items
- Reorder queue positions

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Admin** - Admin panel framework
- **Material-UI (MUI)** - UI components
- **React Router** - Navigation
- **Date-fns** - Date formatting

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- HireMe Backend API running on `http://localhost:3001` (or configure different URL in `.env`)

## Installation

1. Navigate to the admin panel directory:

```bash
cd hireme-admin
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   - Update `.env` file if needed
   - Default API URL: `http://localhost:3001`

## Running the Application

### Development Mode

```bash
npm start
```

The admin panel will open at `http://localhost:3000`

### Production Build

```bash
npm run build
```

The build will be created in the `build` directory.

## Authentication

### Admin-Only Access

- Only users with `user_type = 'admin'` can log in
- Job seekers cannot access the admin panel
- Authentication is enforced at both login and API request levels

### Login Credentials

Use your Job Poster account credentials:

- Email: your admin email
- Password: your admin password

## API Integration

The admin panel integrates with the following backend APIs:

### Job Posts

- `GET /jobPost` - List all job posts
- `GET /jobPost/:id` - Get job post details
- `PUT /jobPost/:id` - Update job post
- `DELETE /jobPost/:id` - Delete job post

### Applicants

- `GET /jobPost/applicants/all` - List all applicants

### Authentication

- `POST /auth/login` - Admin login

## Project Structure

```
hireme-admin/
├── public/                  # Static files
├── src/
│   ├── resources/          # Resource components
│   │   ├── jobPosts.tsx   # Job Posts management
│   │   └── applicants.tsx # Applicants management
│   ├── authProvider.ts    # Authentication logic
│   ├── dataProvider.ts    # API integration
│   ├── Dashboard.tsx      # Main dashboard
│   ├── App.tsx           # Main app component
│   └── index.tsx         # App entry point
├── .env                   # Environment variables
├── package.json          # Dependencies
└── README.md            # This file
```

## Environment Variables

The `.env` file:

```env
REACT_APP_API_URL=http://localhost:3001
```

Change the API URL to point to your backend server.

## Security

- JWT token-based authentication
- Admin-only access enforcement
- Secure token storage in localStorage
- Automatic token injection in API requests
- Auto-logout on authentication errors (401/403)

## Troubleshooting

### Login Failed

- Ensure backend API is running
- Check that you're using Job Poster credentials
- Verify API URL in `.env`

### API Errors

- Check browser console for detailed error messages
- Verify backend API is accessible
- Check authentication token in localStorage

### Build Errors

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

## License

Proprietary - All rights reserved
