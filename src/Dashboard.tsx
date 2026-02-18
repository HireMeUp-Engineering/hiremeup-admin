import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Alert,
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
  totalViews: number;
  applicationsByStatus: { name: string; value: number }[];
  jobPostTrend: { month: string; jobPosts: number; applications: number }[];
  userGrowth: { month: string; totalUsers: number; newUsers: number }[];
  conversionFunnel: { stage: string; count: number }[];
}

const StatCard = ({ title, value, icon, color, onClick }: any) => (
  <Card
    sx={{
      height: "100%",
      cursor: onClick ? "pointer" : "default",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": onClick
        ? {
            transform: "translateY(-2px)",
            boxShadow: 4,
          }
        : {},
    }}
    onClick={onClick}
  >
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
  URL.revokeObjectURL(url);
};

export const Dashboard = () => {
  const dataProvider = useDataProvider();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        setError(null);
        const { data } = await dataProvider.getOne("adminDashboard", {
          id: "stats",
        });

        if (cancelled) return;

        setStats(data as DashboardStats);
      } catch (error: any) {
        if (!cancelled) {
          setError(error?.message || "Failed to load dashboard statistics");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, [dataProvider]);

  if (loading) {
    return (
      <Box p={3}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Failed to load dashboard statistics"}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
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
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => exportReport([{
            totalJobPosts: stats.totalJobPosts,
            publishedJobs: stats.publishedJobs,
            totalApplicants: stats.totalApplicants,
            totalUsers: stats.totalUsers,
            activeUsers: stats.activeUsers,
            blockedUsers: stats.blockedUsers,
            totalInterviews: stats.totalInterviews,
            conversionRate: stats.totalInterviews > 0
              ? `${Math.round((stats.totalInterviews / stats.totalApplicants) * 100)}%`
              : "0%"
          }], "dashboard-summary")}
          sx={{ bgcolor: "#211B43", "&:hover": { bgcolor: "#8759F2" } }}
        >
          Export Summary
        </Button>
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
          onClick={() => navigate("/jobPosts")}
        />
        <StatCard
          title="Published Jobs"
          value={stats.publishedJobs}
          icon={<CheckCircleIcon sx={{ color: "white", fontSize: 30 }} />}
          color="#4caf50"
          onClick={() =>
            navigate("/jobPosts?filter=%7B%22status%22%3A%22published%22%7D")
          }
        />
        <StatCard
          title="Total Applicants"
          value={stats.totalApplicants}
          icon={<AssignmentIcon sx={{ color: "white", fontSize: 30 }} />}
          color="#8759F2"
          onClick={() => navigate("/adminApplications")}
        />
        <StatCard
          title="Total Interviews"
          value={stats.totalInterviews}
          icon={<VideoCallIcon sx={{ color: "white", fontSize: 30 }} />}
          color="#211B43"
          onClick={() => navigate("/interviewAudit")}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<PersonAddIcon sx={{ color: "white", fontSize: 30 }} />}
          color="#1C4A72"
          onClick={() => navigate("/users")}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<PeopleIcon sx={{ color: "white", fontSize: 30 }} />}
          color="#8759F2"
          onClick={() =>
            navigate("/users?filter=%7B%22isActive%22%3A%22true%22%7D")
          }
        />
        <StatCard
          title="Blocked Users"
          value={stats.blockedUsers}
          icon={<BlockIcon sx={{ color: "white", fontSize: 30 }} />}
          color="#8997A4"
          onClick={() =>
            navigate("/users?filter=%7B%22isActive%22%3A%22false%22%7D")
          }
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
                fontSize: "1.1rem",
              },
              "& .MuiCardHeader-subheader": { color: "#ffffff90" },
            }}
            action={
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => exportReport(stats.jobPostTrend, "job-trend")}
                sx={{
                  color: "#ffffff",
                  borderColor: "#ffffff",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "#ffffff",
                  },
                }}
              >
                Export
              </Button>
            }
          />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.jobPostTrend}>
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
                fontSize: "1.1rem",
              },
            }}
            action={
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() =>
                  exportReport(stats.applicationsByStatus, "applications-status")
                }
                sx={{
                  color: "#ffffff",
                  borderColor: "#ffffff",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "#ffffff",
                  },
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
                  data={stats.applicationsByStatus}
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
                  {stats.applicationsByStatus.map((entry, index) => (
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
                fontSize: "1.1rem",
              },
              "& .MuiCardHeader-subheader": { color: "#ffffff90" },
            }}
            action={
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => exportReport(stats.userGrowth, "user-growth")}
                sx={{
                  color: "#ffffff",
                  borderColor: "#ffffff",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "#ffffff",
                  },
                }}
              >
                Export
              </Button>
            }
          />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.userGrowth}>
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
                fontSize: "1.1rem",
              },
              "& .MuiCardHeader-subheader": { color: "#ffffff90" },
            }}
            action={
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() =>
                  exportReport(stats.conversionFunnel, "conversion-funnel")
                }
                sx={{
                  color: "#ffffff",
                  borderColor: "#ffffff",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "#ffffff",
                  },
                }}
              >
                Export
              </Button>
            }
          />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.conversionFunnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#4caf50" name="Count">
                  {stats.conversionFunnel.map((entry, index) => (
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
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
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
                  Monitor job post views, application rates, and posting trends
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
