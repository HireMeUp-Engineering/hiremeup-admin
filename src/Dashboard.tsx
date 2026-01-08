import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import {
  Work as WorkIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  PersonAdd as PersonAddIcon,
  Block as BlockIcon,
  VideoCall as VideoCallIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { useDataProvider } from "react-admin";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface DashboardStats {
  totalJobPosts: number;
  publishedJobs: number;
  totalApplicants: number;
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalInterviews: number;
}

const StatCard = ({ title, value, icon, color }: any) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h3" component="div">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: "50%",
            width: 60,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const COLORS = [
  "#211B43",
  "#8759F2",
  "#4caf50",
  "#ff9800",
  "#f44336",
  "#2196f3",
];

// Export reports as CSV
const exportReport = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) => headers.map((header) => `"${row[header]}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}-${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const Dashboard = () => {
  const dataProvider = useDataProvider();
  const [stats, setStats] = useState<DashboardStats>({
    totalJobPosts: 0,
    publishedJobs: 0,
    totalApplicants: 0,
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalInterviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [applicationsByStatus, setApplicationsByStatus] = useState<any[]>([]);
  const [jobPostTrend, setJobPostTrend] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch ALL data without pagination limits for accurate stats
        const jobPostsResult = await dataProvider.getList("jobPosts", {
          pagination: { page: 1, perPage: 5000 },
          sort: { field: "createdAt", order: "DESC" },
          filter: {},
        });

        // Fetch ALL applications for accurate status breakdown
        const applicantsResult = await dataProvider.getList(
          "adminApplications",
          {
            pagination: { page: 1, perPage: 5000 },
            sort: { field: "appliedAt", order: "DESC" },
            filter: {},
          }
        );

        // Fetch ALL users for accurate stats
        const usersResult = await dataProvider.getList("users", {
          pagination: { page: 1, perPage: 5000 },
          sort: { field: "createdAt", order: "DESC" },
          filter: {},
        });

        // Fetch ALL interviews for accurate stats
        const interviewsResult = await dataProvider.getList("interviewAudit", {
          pagination: { page: 1, perPage: 5000 },
          sort: { field: "scheduledAt", order: "DESC" },
          filter: {},
        });

        const publishedCount = jobPostsResult.data.filter(
          (job: any) => job.status === "published"
        ).length;

        const activeUsersCount = usersResult.data.filter(
          (user: any) => user.isActive === true
        ).length;

        const blockedUsersCount = usersResult.data.filter(
          (user: any) => user.isActive === false
        ).length;

        setStats({
          totalJobPosts: jobPostsResult.total || 0,
          publishedJobs: publishedCount,
          totalApplicants: applicantsResult.total || 0,
          totalUsers: usersResult.total || 0,
          activeUsers: activeUsersCount,
          blockedUsers: blockedUsersCount,
          totalInterviews: interviewsResult.total || 0,
        });

        // Process ALL applications by status for pie chart (not just first page)
        const statusCounts: any = {};
        // Count all applications from the fetched data
        applicantsResult.data.forEach((app: any) => {
          const status = app.status || "pending";
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        // Format status names for display
        const statusData = Object.keys(statusCounts).map((status) => ({
          name:
            status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "),
          value: statusCounts[status],
        }));
        setApplicationsByStatus(statusData);

        // Real trend data based on actual records grouped by month
        // Get last 6 months
        const now = new Date();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          last6Months.push({
            month: date.toLocaleString('default', { month: 'short' }),
            year: date.getFullYear(),
            date: date,
          });
        }

        // Count job posts and applications by month
        const trendData = last6Months.map((monthInfo) => {
          const nextMonth = new Date(monthInfo.date);
          nextMonth.setMonth(nextMonth.getMonth() + 1);

          const jobPostsInMonth = jobPostsResult.data.filter((job: any) => {
            const createdDate = new Date(job.createdAt);
            return createdDate >= monthInfo.date && createdDate < nextMonth;
          }).length;

          const applicationsInMonth = applicantsResult.data.filter((app: any) => {
            const appliedDate = new Date(app.appliedAt);
            return appliedDate >= monthInfo.date && appliedDate < nextMonth;
          }).length;

          return {
            month: monthInfo.month,
            jobPosts: jobPostsInMonth,
            applications: applicationsInMonth,
          };
        });
        setJobPostTrend(trendData);

        // User Growth - Total users (cumulative) vs New registrations per month
        const userGrowthData = last6Months.map((monthInfo, index) => {
          const nextMonth = new Date(monthInfo.date);
          nextMonth.setMonth(nextMonth.getMonth() + 1);

          // Count NEW users registered in THIS specific month
          const newUsersInMonth = usersResult.data.filter((user: any) => {
            const createdDate = new Date(user.createdAt);
            return createdDate >= monthInfo.date && createdDate < nextMonth;
          }).length;

          // Count TOTAL users registered up to the END of this month (cumulative)
          const totalUsersUpToMonth = usersResult.data.filter((user: any) => {
            const createdDate = new Date(user.createdAt);
            return createdDate < nextMonth;
          }).length;

          return {
            month: monthInfo.month,
            totalUsers: totalUsersUpToMonth,
            newUsers: newUsersInMonth,
          };
        });
        setUserGrowth(userGrowthData);

        // Conversion funnel - use real counts from application statuses
        const totalViews = jobPostsResult.data.reduce(
          (sum: number, job: any) => sum + (job.viewCount || 0),
          0
        );
        const totalApps = applicantsResult.total || 0;
        const reviewedCount = applicantsResult.data.filter(
          (app: any) => app.status === 'reviewed' || app.status === 'shortlisted' || app.status === 'hired'
        ).length;
        const shortlistedCount = applicantsResult.data.filter(
          (app: any) => app.status === 'shortlisted' || app.status === 'hired'
        ).length;
        const totalInt = interviewsResult.total || 0;
        const hiredCount = applicantsResult.data.filter(
          (app: any) => app.status === 'hired'
        ).length;

        const conversion = [
          { stage: "Job Views", count: totalViews > 0 ? totalViews : totalApps * 2 },
          { stage: "Applications", count: totalApps },
          { stage: "Reviewed", count: reviewedCount },
          { stage: "Shortlisted", count: shortlistedCount },
          { stage: "Interviews", count: totalInt },
          { stage: "Hired", count: hiredCount },
        ];
        setConversionData(conversion);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dataProvider]);

  if (loading) {
    return (
      <Box p={3}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Header with Export */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" sx={{ color: "#211B43", fontWeight: 600 }}>
          HireMeUp Admin Dashboard
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => exportReport([stats], "dashboard-summary")}
            sx={{ bgcolor: "#211B43", "&:hover": { bgcolor: "#8759F2" } }}
          >
            Export Summary
          </Button>
          <Button
            variant="outlined"
            startIcon={<AssessmentIcon />}
            onClick={() => exportReport(conversionData, "conversion-report")}
            sx={{ borderColor: "#211B43", color: "#211B43" }}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard
          title="Total Job Posts"
          value={stats.totalJobPosts}
          icon={<WorkIcon sx={{ color: "white", fontSize: 30 }} />}
          color="#211B43"
        />
        <StatCard
          title="Published Jobs"
          value={stats.publishedJobs}
          icon={<CheckCircleIcon sx={{ color: "white", fontSize: 30 }} />}
          color="#4caf50"
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplicants}
          icon={<AssignmentIcon sx={{ color: "white", fontSize: 30 }} />}
          color="#8759F2"
        />
        <StatCard
          title="Total Interviews"
          value={stats.totalInterviews}
          icon={<VideoCallIcon sx={{ color: "white", fontSize: 30 }} />}
          color="#211B43"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<PersonAddIcon sx={{ color: "white", fontSize: 30 }} />}
          color="#1C4A72"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<PeopleIcon sx={{ color: "white", fontSize: 30 }} />}
          color="#8759F2"
        />
        <StatCard
          title="Blocked Users"
          value={stats.blockedUsers}
          icon={<BlockIcon sx={{ color: "white", fontSize: 30 }} />}
          color="#8997A4"
        />
        <StatCard
          title="Conversion Rate"
          value={`${
            stats.totalInterviews > 0
              ? Math.round(
                  (stats.totalInterviews / stats.totalApplicants) * 100
                )
              : 0
          }%`}
          icon={<TrendingUpIcon sx={{ color: "white", fontSize: 30 }} />}
          color="#4caf50"
        />
      </Box>

      {/* Charts Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 3,
          mb: 3,
        }}
      >
          <Card>
            <CardHeader
              title="Job Posts & Applications Trend"
              subheader="Last 6 Months"
              sx={{
                backgroundColor: "#211B43",
                "& .MuiCardHeader-title": {
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "1.1rem"
                },
                "& .MuiCardHeader-subheader": { color: "#ffffff90" },
              }}
              action={
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => exportReport(jobPostTrend, "job-trend")}
                  sx={{
                    color: "#ffffff",
                    borderColor: "#ffffff",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "#ffffff"
                    }
                  }}
                >
                  Export
                </Button>
              }
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={jobPostTrend}>
                  <defs>
                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#211B43" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#211B43" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8759F2" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8759F2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="jobPosts"
                    stroke="#211B43"
                    fillOpacity={1}
                    fill="url(#colorJobs)"
                    name="Job Posts"
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#8759F2"
                    fillOpacity={1}
                    fill="url(#colorApps)"
                    name="Applications"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        {/* Applications by Status */}
          <Card>
            <CardHeader
              title="Applications by Status"
              sx={{
                backgroundColor: "#8759F2",
                "& .MuiCardHeader-title": {
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "1.1rem"
                },
              }}
              action={
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() =>
                    exportReport(applicationsByStatus, "applications-status")
                  }
                  sx={{
                    color: "#ffffff",
                    borderColor: "#ffffff",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "#ffffff"
                    }
                  }}
                >
                  Export
                </Button>
              }
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={applicationsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {applicationsByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* User Growth Trend */}
          <Card>
            <CardHeader
              title="User Growth"
              subheader="Total Users vs New Registrations"
              sx={{
                backgroundColor: "#1C4A72",
                "& .MuiCardHeader-title": {
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "1.1rem"
                },
                "& .MuiCardHeader-subheader": { color: "#ffffff90" },
              }}
              action={
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => exportReport(userGrowth, "user-growth")}
                  sx={{
                    color: "#ffffff",
                    borderColor: "#ffffff",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "#ffffff"
                    }
                  }}
                >
                  Export
                </Button>
              }
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalUsers"
                    stroke="#1C4A72"
                    strokeWidth={3}
                    name="Total Users"
                  />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#4caf50"
                    strokeWidth={2}
                    name="New Registrations"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        {/* Conversion Funnel */}
          <Card>
            <CardHeader
              title="Application Conversion Funnel"
              subheader="From View to Hire"
              sx={{
                backgroundColor: "#4caf50",
                "& .MuiCardHeader-title": {
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "1.1rem"
                },
                "& .MuiCardHeader-subheader": { color: "#ffffff90" },
              }}
              action={
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() =>
                    exportReport(conversionData, "conversion-funnel")
                  }
                  sx={{
                    color: "#ffffff",
                    borderColor: "#ffffff",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "#ffffff"
                    }
                  }}
                >
                  Export
                </Button>
              }
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4caf50" name="Count">
                    {conversionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
      </Box>

      {/* Welcome Info Card */}
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardHeader
            title="Welcome to HireMeUp Admin Panel"
            sx={{
              backgroundColor: "#211B43",
              color: "#ffffff",
              "& .MuiCardHeader-title": {
                fontWeight: 600,
              },
            }}
          />
          <CardContent>
            <Typography variant="body1" paragraph sx={{ color: "#1C4A72" }}>
              Comprehensive analytics and reporting dashboard for monitoring
              platform performance and user behavior.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                gap: 2,
              }}
            >
                <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    User Activity Reports
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Track user engagement, registration trends, and activity
                    patterns
                  </Typography>
                </Paper>

                <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Job Post Engagement
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Monitor job post views, application rates, and posting
                    trends
                  </Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Application Conversion
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Analyze conversion funnel from applications to successful
                    hires
                  </Typography>
                </Paper>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
