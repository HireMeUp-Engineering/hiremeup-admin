# Backend API Analysis for Admin Panel

## ✅ EXISTING BACKEND APIs

### 1. User Management (ADMIN ONLY)

#### Get All Users

- **Endpoint**: `GET /admin/users`
- **Role Required**: `ADMIN`
- **Features**:
  - Pagination (page, limit)
  - Filter by roleType (JOB_SEEKER, JOB_POSTER, ADMIN)
  - Filter by isActive (true/false)
  - Search by name or email
  - Sort by createdAt, lastLogin, email
  - Sort order ASC/DESC
- **Response**: Users list with profiles, subscriptions, lastLogin, createdAt, etc.

#### Get User Details

- **Endpoint**: `GET /admin/users/:id`
- **Role Required**: `ADMIN`
- **Features**:
  - Complete user profile
  - Subscription details
  - Activity logs (latest 50)
  - Job posts (for JOB_POSTER)
  - Job applications (for JOB_SEEKER)
  - User statistics

#### Block User

- **Endpoint**: `PATCH /admin/users/:id/block`
- **Role Required**: `ADMIN`
- **Body**: `{ reason?: string }`
- **Features**:
  - Sets isActive = false
  - Cannot block ADMIN users
  - Returns updated user

#### Unblock User

- **Endpoint**: `PATCH /admin/users/:id/unblock`
- **Role Required**: `ADMIN`
- **Features**:
  - Sets isActive = true
  - Returns updated user

---

### 2. Job Post Oversight

#### View All Job Posts

- **Endpoint**: `GET /jobPost`
- **Role Required**: JOB_POSTER (but accessible to ADMIN)
- **Features**:
  - Filter by status, location, jobType
  - Include applications
  - Returns complete job post details

---

### 3. Application Moderation (ADMIN ONLY)

#### Get All Applications

- **Endpoint**: `GET /admin/applications`
- **Role Required**: `ADMIN`
- **Features**:
  - Pagination
  - Filter by jobPostId, applicantId, status, minRating
  - Search by applicant name or job title
  - Sort by various fields
  - Returns applications with videos, transcripts, status

#### Get Application Details

- **Endpoint**: `GET /admin/applications/:id`
- **Role Required**: `ADMIN`
- **Features**:
  - Complete application details
  - Videos and audio recordings
  - Transcripts
  - Answers to questions
  - Rejection feedback
  - Associated interviews

#### Update Application Notes

- **Endpoint**: `PATCH /admin/applications/:id/notes`
- **Role Required**: `ADMIN`
- **Body**: `{ notes: string }`

#### Update Application Rating

- **Endpoint**: `PATCH /admin/applications/:id/rating`
- **Role Required**: `ADMIN`
- **Body**: `{ rating: number }` (0-5)

#### Update Application Status

- **Endpoint**: `PATCH /admin/applications/:id/status`
- **Role Required**: `ADMIN`
- **Body**: `{ status: ApplicationStatus }`
- **Valid Statuses**: pending, in_queue, reviewed, shortlisted, rejected, hired

#### Get Rejection Feedback

- **Endpoint**: `GET /admin/applications/rejection-feedback/list`
- **Role Required**: `ADMIN`
- **Features**:
  - Pagination
  - Filter by jobPostId, applicantId, screeningType
  - Date range filtering (startDate, endDate)
  - Returns rejection reasons and feedback for fair practice monitoring

---

### 4. Interview Audit (ADMIN ONLY)

#### Audit Interviews

- **Endpoint**: `GET /admin/interviews/audit`
- **Role Required**: `ADMIN`
- **Features**:
  - Pagination
  - Filter by applicationId, seekerId, posterId, status
  - Filter by hasRecording
  - Date range filtering
  - Returns interview logs and recordings for compliance monitoring

---

## 🔴 CURRENT ADMIN PANEL STATUS

### ✅ Already Implemented

1. **Dashboard** - Statistics and overview
2. **Job Posts Management** - View, edit, delete job posts
3. **Applicants View** - View all applications
4. **Queue Management** - Manage review queue, send questions

### ❌ Missing Features (Need to Add)

1. **User Management**

   - Manage Job Seekers (view, search, filter)
   - Manage Job Posters (view, search, filter)
   - Block/Unblock Users
   - View user details (profiles, subscriptions, activity logs)

2. **Application Moderation**
   - Update application notes
   - Update application rating
   - Update application status
   - View rejection feedback
   - Audit interviews

---

## 🎯 REQUIRED UPDATES TO ADMIN PANEL

### 1. Update Authentication Provider

**Current**: Only checks for `user_type = 'job_poster'`
**Required**: Check for `user_type = 'admin'`

### 2. Add New Resources

#### Users Resource

- List users with filters (Job Seekers, Job Posters, all)
- View user details with tabs:
  - Profile information
  - Subscriptions
  - Activity logs
  - Job posts (for posters) or Applications (for seekers)
  - Statistics
- Block/Unblock buttons
- Search and filter functionality

#### Enhanced Applications Resource

- Add admin actions:
  - Update notes
  - Update rating (0-5 stars)
  - Update status
- View rejection feedback tab
- Filter and search improvements

#### Interviews Resource (NEW)

- Audit interview logs
- Filter by status, participants, date
- View recordings
- Compliance monitoring

#### Rejection Feedback Resource (NEW)

- View all rejection feedback
- Filter by job post, applicant, date
- Monitor for fair practices
- Export functionality

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Authentication

- [ ] Update authProvider to support ADMIN role
- [ ] Add role-based access control in UI

### Phase 2: User Management

- [ ] Create Users resource component
- [ ] Add user list with filters
- [ ] Add user detail view
- [ ] Implement block/unblock functionality
- [ ] Add activity logs view
- [ ] Add user statistics

### Phase 3: Enhanced Applications

- [ ] Add admin notes functionality
- [ ] Add rating system (stars)
- [ ] Add status update
- [ ] Improve video/audio playback
- [ ] Add transcript viewing

### Phase 4: Moderation Features

- [ ] Create Rejection Feedback resource
- [ ] Create Interview Audit resource
- [ ] Add filtering and search
- [ ] Add export functionality

### Phase 5: Dashboard Enhancements

- [ ] Add admin-specific statistics
- [ ] Add moderation alerts
- [ ] Add recent activity feed

---

## 🔐 IMPORTANT NOTES

1. **All admin endpoints require `UserType.ADMIN` role**
2. **Current admin panel checks for `JOB_POSTER` - needs to be updated to `ADMIN`**
3. **Backend is fully ready with all required APIs**
4. **Only UI implementation is needed**
