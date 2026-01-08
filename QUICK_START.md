# Quick Start Guide - HireMe Admin Panel

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd /home/jellyfish/hireme/hireme-admin
npm install
```

### 2. Configure Environment
The `.env` file is already configured:
```env
REACT_APP_API_URL=http://localhost:3001
```

### 3. Start the Admin Panel
```bash
npm start
```

The admin panel will open at **http://localhost:3000**

## 🔐 Login

Use your **Job Poster** credentials:
- Email: your job poster email
- Password: your job poster password

**Note:** Only users with `userType = 'job_poster'` can access the admin panel.

## 📋 Main Features

### Dashboard
- View statistics for job posts, applicants, and queue
- Quick overview of system metrics

### Job Posts
- Navigate to "Job Posts" from the menu
- View, edit, and delete job posts
- See all questions and screening responses

### Applicants
- Navigate to "Applicants" from the menu
- View all applications across all job posts
- Filter by status
- View applicant profiles and ratings

### Review Queue
- Navigate to "Review Queue" from the menu
- Manage applications in the queue
- **Send Questions:** Click "Send Question" button to send a question to an applicant
- Update queue status
- Add notes to queue items

## 🎯 Common Tasks

### Send a Question to an Applicant
1. Go to "Review Queue"
2. Find the application you want to send a question to
3. Click "Send Question" button
4. Select a question from the dialog
5. Click "Send Question"
6. Queue status automatically updates to "Awaiting Response"

### View Applicant Details
1. Go to "Applicants"
2. Click "Show" on any applicant
3. View complete profile, application details, and answers

### Edit Job Post
1. Go to "Job Posts"
2. Click "Edit" on the job post
3. Update the fields
4. Click "Save"

### Manage Queue
1. Go to "Review Queue"
2. Click "Edit" to update status, notes, or position
3. Click "Delete" to remove from queue

## 🛠️ Troubleshooting

### Can't Login
- Make sure the backend is running: `http://localhost:3001`
- Use Job Poster credentials (not Job Seeker)
- Check browser console for errors

### API Errors
- Ensure backend is accessible at `http://localhost:3001`
- Check that you're logged in (JWT token in localStorage)
- Verify CORS is enabled on the backend

### Build Issues
```bash
# Clear and reinstall
rm -rf node_modules
npm install
```

## 📞 Need Help?

Check the full [README.md](./README.md) for detailed documentation.
