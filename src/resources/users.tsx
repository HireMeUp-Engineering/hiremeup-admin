import React, { useState } from "react";
import {
  List,
  Datagrid,
  Show,
  TabbedShowLayout,
  Tab,
  FunctionField,
  useDataProvider,
  useNotify,
  useRefresh,
  Button as RAButton,
  TextInput,
  SelectInput,
  ShowButton,
  FilterButton,
  TopToolbar,
  ExportButton,
} from "react-admin";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  TextField as MUITextField,
  List as MUIList,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Link as MUILink,
} from "@mui/material";
import {
  People as PeopleIcon,
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  CalendarToday,
  Email as EmailIcon,
} from "@mui/icons-material";
import { EnhancedChip } from "../components/shared/EnhancedChip";
import { formatRelativeTime } from "../utils/dateFormatters";

const BlockUserButton = ({ record }: any) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleBlock = async () => {
    try {
      await dataProvider.update("users", {
        id: record.id,
        data: { action: "block", reason },
        previousData: record,
      });
      notify("User blocked successfully", { type: "success" });
      setOpen(false);
      refresh();
    } catch (error: any) {
      notify(`Error: ${error.message}`, { type: "error" });
    }
  };

  if (record.isActive === false) {
    return null; // Already blocked
  }

  return (
    <>
      <RAButton
        label="Block"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <BlockIcon />
      </RAButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Block User</DialogTitle>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <Typography variant="body2" paragraph>
            Are you sure you want to block {record.firstName} {record.lastName}?
          </Typography>
          <MUITextField
            label="Reason (optional)"
            multiline
            rows={3}
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleBlock();
            }}
            variant="contained"
            color="error"
            startIcon={<BlockIcon />}
          >
            Block User
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const UnblockUserButton = ({ record }: any) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleUnblock = async () => {
    try {
      await dataProvider.update("users", {
        id: record.id,
        data: { action: "unblock" },
        previousData: record,
      });
      notify("User unblocked successfully", { type: "success" });
      refresh();
    } catch (error: any) {
      notify(`Error: ${error.message}`, { type: "error" });
    }
  };

  if (record.isActive === true) {
    return null; // Already active
  }

  return (
    <RAButton
      label="Unblock"
      onClick={(e) => {
        e.stopPropagation();
        handleUnblock();
      }}
    >
      <UnblockIcon />
    </RAButton>
  );
};

const userFilters = [
  <TextInput key="search" label="Search" source="search" alwaysOn />,
  <SelectInput
    key="roleType"
    source="roleType"
    label="User Type"
    choices={[
      { id: "jobSeeker", name: "Job Seeker" },
      { id: "jobPoster", name: "Job Poster" },
      { id: "admin", name: "Admin" },
    ]}
  />,
  <SelectInput
    key="isActive"
    source="isActive"
    label="Status"
    choices={[
      { id: "true", name: "Active" },
      { id: "false", name: "Inactive" },
    ]}
  />,
];

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

export const UserList = () => (
  <List
    filters={userFilters}
    actions={<ListActions />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <FunctionField
        label="User"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              src={record.profileImage}
              alt={`${record.firstName} ${record.lastName}`}
              sx={{ width: 40, height: 40 }}
            >
              {record.firstName?.[0]}
              {record.lastName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {record.firstName} {record.lastName}
              </Typography>
            </Box>
          </Box>
        )}
      />
      <FunctionField
        label="Email"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <MUILink
              component={Link}
              to={`/users/${record.id}/show`}
              sx={{
                color: "#8759F2",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {record.email}
            </MUILink>
          </Box>
        )}
      />
      <FunctionField
        label="Role"
        render={(record: any) => (
          <Box>
            {record.roles?.map((role: string, index: number) => (
              <EnhancedChip
                key={index}
                status={
                  role === "admin"
                    ? "active"
                    : role === "job_poster"
                    ? "published"
                    : "pending"
                }
                label={role.replace("_", " ")}
              />
            ))}
          </Box>
        )}
      />
      <FunctionField
        label="Active"
        render={(record: any) => (
          <EnhancedChip
            status={record.isActive ? "active" : "rejected"}
            label={record.isActive ? "Active" : "Blocked"}
          />
        )}
      />
      <FunctionField
        label="Profile Complete"
        render={(record: any) => (
          <EnhancedChip
            status={record.profileComplete ? "completed" : "pending"}
            label={record.profileComplete ? "Complete" : "Incomplete"}
          />
        )}
      />
      <FunctionField
        label="Last Login"
        sortable
        sortBy="lastLogin"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography
              variant="body2"
              title={
                record.lastLogin
                  ? new Date(record.lastLogin).toLocaleString()
                  : "Never"
              }
            >
              {record.lastLogin
                ? formatRelativeTime(record.lastLogin)
                : "Never"}
            </Typography>
          </Box>
        )}
      />
      <FunctionField
        label="Joined"
        sortable
        sortBy="createdAt"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography
              variant="body2"
              title={new Date(record.createdAt).toLocaleString()}
            >
              {formatRelativeTime(record.createdAt)}
            </Typography>
          </Box>
        )}
      />
      <FunctionField
        label="Actions"
        render={(record: any) => (
          <Box display="flex" gap={1}>
            <ShowButton />
            <BlockUserButton record={record} />
            <UnblockUserButton record={record} />
          </Box>
        )}
      />
    </Datagrid>
  </List>
);

export const UserShow = () => (
  <Show>
    <TabbedShowLayout>
      <Tab label="Overview">
        <FunctionField
          label="User Information"
          render={(record: any) => (
            <Box>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar
                  src={record.profileImage}
                  alt={`${record.firstName} ${record.lastName}`}
                  sx={{ width: 80, height: 80 }}
                >
                  {record.firstName?.[0]}
                  {record.lastName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h5">
                    {record.firstName} {record.lastName}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {record.email}
                  </Typography>
                  <Box mt={1}>
                    {record.roles?.map((role: string, index: number) => (
                      <Chip
                        key={index}
                        label={role.replace("_", " ")}
                        size="small"
                        sx={{ mr: 0.5 }}
                        color={
                          role === "admin"
                            ? "error"
                            : role === "job_poster"
                            ? "primary"
                            : "default"
                        }
                      />
                    ))}
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    md: "repeat(2, 1fr)",
                  },
                  gap: 2,
                }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      Account Status
                    </Typography>
                    <Chip
                      label={record.isActive ? "Active" : "Blocked"}
                      color={record.isActive ? "success" : "error"}
                      sx={{ mt: 1 }}
                    />
                    {!record.isActive && record.blockReason && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          bgcolor: "#ffebee",
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="subtitle2" color="error">
                          Block Reason:
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {record.blockReason}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      Profile Status
                    </Typography>
                    <Chip
                      label={record.profileComplete ? "Complete" : "Incomplete"}
                      color={record.profileComplete ? "success" : "warning"}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      Last Login
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {record.lastLogin
                        ? new Date(record.lastLogin).toLocaleString()
                        : "Never"}
                    </Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      Joined
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {new Date(record.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}
        />
      </Tab>

      <Tab label="Profiles">
        <FunctionField
          label="User Profiles"
          render={(record: any) => (
            <Box>
              {record.profiles && record.profiles.length > 0 ? (
                record.profiles.map((profile: any, index: number) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">Profile {index + 1}</Typography>
                      <Divider sx={{ my: 1 }} />
                      {profile.bio && (
                        <Typography variant="body2" paragraph>
                          <strong>Bio:</strong> {profile.bio}
                        </Typography>
                      )}
                      {profile.city && (
                        <Typography variant="body2">
                          <strong>Location:</strong> {profile.city},{" "}
                          {profile.state}
                        </Typography>
                      )}
                      {profile.businessName && (
                        <Typography variant="body2">
                          <strong>Business:</strong> {profile.businessName}
                        </Typography>
                      )}
                      {profile.industry && (
                        <Typography variant="body2">
                          <strong>Industry:</strong> {profile.industry}
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Status: {profile.status} | Created:{" "}
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography color="textSecondary">No profiles</Typography>
              )}
            </Box>
          )}
        />
      </Tab>

      <Tab label="Subscriptions">
        <FunctionField
          label="Subscriptions"
          render={(record: any) => (
            <Box>
              {record.subscriptions && record.subscriptions.length > 0 ? (
                record.subscriptions.map((sub: any, index: number) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{sub.planName}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2">
                        <strong>Status:</strong>{" "}
                        <Chip
                          label={sub.status}
                          size="small"
                          color={
                            sub.status === "active" ? "success" : "default"
                          }
                        />
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Period:</strong>{" "}
                        {new Date(sub.currentPeriodStart).toLocaleDateString()}{" "}
                        - {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography color="textSecondary">No subscriptions</Typography>
              )}
            </Box>
          )}
        />
      </Tab>

      <Tab label="Activity Logs">
        <FunctionField
          label="Recent Activity"
          render={(record: any) => (
            <Box>
              {record.activityLogs && record.activityLogs.length > 0 ? (
                <MUIList>
                  {record.activityLogs.map((log: any, index: number) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={`${log.action} - ${log.entity}`}
                          secondary={
                            <>
                              {log.details && (
                                <Typography variant="body2">
                                  {log.details}
                                </Typography>
                              )}
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                {new Date(log.createdAt).toLocaleString()}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < record.activityLogs.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </MUIList>
              ) : (
                <Typography color="textSecondary">No activity logs</Typography>
              )}
            </Box>
          )}
        />
      </Tab>

      <Tab label="Job Posts" path="job-posts">
        <FunctionField
          label="Job Posts"
          render={(record: any) => (
            <Box>
              {record.jobPosts && record.jobPosts.length > 0 ? (
                record.jobPosts.map((job: any, index: number) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{job.jobTitle}</Typography>
                      <Chip label={job.status} size="small" sx={{ mt: 1 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Applications:</strong> {job.applicationCount}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Posted: {new Date(job.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography color="textSecondary">No job posts</Typography>
              )}
            </Box>
          )}
        />
      </Tab>

      <Tab label="Job Applications" path="job-applications">
        <FunctionField
          label="Job Applications"
          render={(record: any) => (
            <Box>
              {record.jobApplications && record.jobApplications.length > 0 ? (
                record.jobApplications.map((app: any, index: number) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{app.jobTitle}</Typography>
                      <Chip label={app.status} size="small" sx={{ mt: 1 }} />
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography color="textSecondary">
                  No job applications
                </Typography>
              )}
            </Box>
          )}
        />
      </Tab>

      <Tab label="Statistics">
        <FunctionField
          label="User Statistics"
          render={(record: any) => (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              {record.statistics?.totalJobsPosted !== undefined && (
                <Card>
                  <CardContent>
                    <WorkIcon color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h4" sx={{ mt: 1 }}>
                      {record.statistics.totalJobsPosted}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Jobs Posted
                    </Typography>
                  </CardContent>
                </Card>
              )}
              {record.statistics?.totalApplicationsReceived !== undefined && (
                <Card>
                  <CardContent>
                    <AssignmentIcon color="secondary" sx={{ fontSize: 40 }} />
                    <Typography variant="h4" sx={{ mt: 1 }}>
                      {record.statistics.totalApplicationsReceived}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Applications Received
                    </Typography>
                  </CardContent>
                </Card>
              )}
              {record.statistics?.totalJobsApplied !== undefined && (
                <Card>
                  <CardContent>
                    <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h4" sx={{ mt: 1 }}>
                      {record.statistics.totalJobsApplied}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Jobs Applied
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
        />
      </Tab>
    </TabbedShowLayout>
  </Show>
);

export const userResource = {
  list: UserList,
  show: UserShow,
  icon: PeopleIcon,
};
