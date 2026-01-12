import React from 'react';
import { Admin, Resource } from 'react-admin';
import { authProvider } from './authProvider';
import { dataProvider } from './dataProvider';
import { Dashboard } from './Dashboard';
import { Layout } from './Layout';
import { LoginPage } from './LoginPage';
import { theme } from './theme';
import { jobPostResource } from './resources/jobPosts';
import { userResource } from './resources/users';
import { adminApplicationResource } from './resources/adminApplications';
import { rejectionFeedbackResource } from './resources/rejectionFeedback';
import { interviewAuditResource } from './resources/interviewAudit';
import { supportTicketResource } from './resources/supportTickets';
import { feedbackResource } from './resources/feedback';

const App = () => {
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      dashboard={Dashboard}
      layout={Layout}
      loginPage={LoginPage}
      theme={theme}
      title="HireMeUp Admin Panel"
      disableTelemetry
    >
      {/* User Management - View, Block/Unblock */}
      <Resource
        name="users"
        {...userResource}
        options={{ label: 'User Management' }}
      />

      {/* Job Post Oversight - View Only */}
      <Resource
        name="jobPosts"
        {...jobPostResource}
        options={{ label: 'Job Posts' }}
      />

      {/* Application Moderation - Review Applications */}
      <Resource
        name="adminApplications"
        {...adminApplicationResource}
        options={{ label: 'Applications' }}
      />

      {/* Moderation - Rejection Feedback */}
      <Resource
        name="rejectionFeedback"
        {...rejectionFeedbackResource}
        options={{ label: 'Rejection Feedback' }}
      />

      {/* Moderation - Interview Audit */}
      <Resource
        name="interviewAudit"
        {...interviewAuditResource}
        options={{ label: 'Interview Audit' }}
      />

      {/* Support & Feedback - Support Tickets */}
      <Resource
        name="supportTickets"
        {...supportTicketResource}
        options={{ label: 'Support Tickets' }}
      />

      {/* Support & Feedback - App Feedback */}
      <Resource
        name="feedback"
        {...feedbackResource}
        options={{ label: 'App Feedback' }}
      />
    </Admin>
  );
};

export default App;
