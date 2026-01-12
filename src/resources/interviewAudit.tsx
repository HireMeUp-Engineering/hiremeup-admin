import React from "react";
import {
  List,
  Datagrid,
  Show,
  SimpleShowLayout,
  FunctionField,
  TextInput,
  SelectInput,
  DateInput,
  ShowButton,
  FilterButton,
  TopToolbar,
  ExportButton,
} from "react-admin";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import {
  VideoCall as VideoCallIcon,
  PlayCircle as PlayCircleIcon,
  CalendarToday,
  Videocam,
} from "@mui/icons-material";
import { EnhancedChip } from "../components/shared/EnhancedChip";
import { formatRelativeTime } from "../utils/dateFormatters";

const interviewFilters = [
  <TextInput key="search" label="Search" source="search" alwaysOn />,
  <SelectInput
    key="status"
    source="status"
    choices={[
      { id: "scheduled", name: "Scheduled" },
      { id: "in_progress", name: "In Progress" },
      { id: "completed", name: "Completed" },
      { id: "cancelled", name: "Cancelled" },
    ]}
  />,
  <DateInput key="startDate" label="From Date" source="startDate" />,
  <DateInput key="endDate" label="To Date" source="endDate" />,
];

const getStatusColor = (status: string) => {
  const statusColors: { [key: string]: string } = {
    scheduled: "#2196f3",
    in_progress: "#ff9800",
    completed: "#4caf50",
    cancelled: "#f44336",
  };
  return statusColors[status] || "#757575";
};

const formatStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    scheduled: "Scheduled",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return statusMap[status] || status;
};

// Custom exporter for interview audit
const interviewAuditExporter = (records: any[]) => {
  const headers = [
    "Interviewee Name",
    "Interviewee Email",
    "Interviewer Name",
    "Interviewer Email",
    "Job Title",
    "Status",
    "Has Recording",
    "Duration (minutes)",
    "Scheduled",
    "Started",
    "Ended",
  ];

  const rows = records.map((record) => [
    record.intervieweeName || "",
    record.intervieweeEmail || "",
    record.interviewerName || "",
    record.interviewerEmail || "",
    record.jobTitle || "N/A",
    formatStatus(record.status || ""),
    record.recordingUrl ? "Yes" : "No",
    record.durationMinutes || "N/A",
    new Date(record.scheduledAt).toLocaleString(),
    record.startedAt
      ? new Date(record.startedAt).toLocaleString()
      : "Not started",
    record.endedAt ? new Date(record.endedAt).toLocaleString() : "Not ended",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `interview-audit-${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton maxResults={5000} />
  </TopToolbar>
);

export const InterviewAuditList = () => (
  <List
    filters={interviewFilters}
    actions={<ListActions />}
    sort={{ field: "scheduledAt", order: "DESC" }}
    exporter={interviewAuditExporter}
    perPage={20}
  >
    <Datagrid rowClick="show">
      <FunctionField
        label="Interviewee"
        sortable
        sortBy="intervieweeName"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 36, height: 36 }}>
              {record.intervieweeName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {record.intervieweeName || "N/A"}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {record.intervieweeEmail || ""}
              </Typography>
            </Box>
          </Box>
        )}
      />
      <FunctionField
        label="Interviewer"
        sortable
        sortBy="interviewerName"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 36, height: 36 }}>
              {record.interviewerName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {record.interviewerName || "N/A"}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {record.interviewerEmail || ""}
              </Typography>
            </Box>
          </Box>
        )}
      />
      <FunctionField
        label="Job Post"
        sortable
        sortBy="jobTitle"
        render={(record: any) => (
          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
            {record.jobTitle || "N/A"}
          </Typography>
        )}
      />
      <FunctionField
        label="Status"
        sortable
        sortBy="status"
        render={(record: any) => <EnhancedChip status={record.status} />}
      />
      <FunctionField
        label="Recording"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            {record.recordingUrl && (
              <Videocam sx={{ fontSize: 18, color: "#4caf50" }} />
            )}
            <Chip
              label={record.recordingUrl ? "Yes" : "No"}
              size="small"
              color={record.recordingUrl ? "success" : "default"}
              variant="outlined"
            />
          </Box>
        )}
      />
      <FunctionField
        label="Duration"
        sortable
        sortBy="durationMinutes"
        render={(record: any) =>
          record.durationMinutes ? (
            <Typography variant="body2">
              {record.durationMinutes} min
            </Typography>
          ) : (
            <Typography variant="caption" color="textSecondary">
              N/A
            </Typography>
          )
        }
      />
      <FunctionField
        label="Scheduled"
        sortable
        sortBy="scheduledAt"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography
              variant="body2"
              title={new Date(record.scheduledAt).toLocaleString()}
            >
              {formatRelativeTime(record.scheduledAt)}
            </Typography>
          </Box>
        )}
      />
      <ShowButton />
    </Datagrid>
  </List>
);

export const InterviewAuditShow = () => (
  <Show>
    <SimpleShowLayout>
      <FunctionField
        label=""
        render={(record: any) => (
          <Box>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Interview Participants</Typography>
                <Divider sx={{ my: 1 }} />

                <Box mb={2}>
                  <Typography variant="subtitle2">Interviewee</Typography>
                  <Box mt={1}>
                    <Typography variant="body1" fontWeight={500}>
                      {record.intervieweeName || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {record.intervieweeEmail || ""}
                    </Typography>
                    {/* <Typography variant="caption" color="textSecondary">
                      User ID: {record.intervieweeId}
                    </Typography> */}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2">Interviewer</Typography>
                  <Box mt={1}>
                    <Typography variant="body1" fontWeight={500}>
                      {record.interviewerName || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {record.interviewerEmail || ""}
                    </Typography>
                    {/* <Typography variant="caption" color="textSecondary">
                      User ID: {record.interviewerId}
                    </Typography> */}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Interview Details</Typography>
                <Divider sx={{ my: 1 }} />

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Job Post:</strong> {record.jobTitle || "N/A"}
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Status:</strong>{" "}
                  <Chip
                    label={formatStatus(record.status)}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(record.status),
                      color: "white",
                    }}
                  />
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Room ID:</strong> {record.roomId}
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Scheduled At:</strong>{" "}
                  {new Date(record.scheduledAt).toLocaleString()}
                </Typography>

                {record.startedAt && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Started At:</strong>{" "}
                    {new Date(record.startedAt).toLocaleString()}
                  </Typography>
                )}

                {record.endedAt && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Ended At:</strong>{" "}
                    {new Date(record.endedAt).toLocaleString()}
                  </Typography>
                )}

                {record.durationMinutes && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Duration:</strong> {record.durationMinutes} minutes
                  </Typography>
                )}

                {record.notes && (
                  <Box mt={2}>
                    <Typography variant="subtitle2">Notes</Typography>
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: "pre-wrap", mt: 1 }}
                    >
                      {record.notes}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {record.recordingUrl && (
              <Card>
                <CardContent>
                  <Typography variant="h6">Interview Recording</Typography>
                  <Divider sx={{ my: 1 }} />

                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <PlayCircleIcon color="primary" />
                      <Typography variant="body1">
                        Recording Available
                      </Typography>
                    </Box>
                    <video
                      src={record.recordingUrl}
                      controls
                      style={{ width: "100%", maxWidth: 800, borderRadius: 8 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            )}

            {!record.recordingUrl && (
              <Card>
                <CardContent>
                  <Typography variant="h6">Interview Recording</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    No recording available for this interview
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      />
    </SimpleShowLayout>
  </Show>
);

export const interviewAuditResource = {
  list: InterviewAuditList,
  show: InterviewAuditShow,
  icon: VideoCallIcon,
};
