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
  LocationOn,
  Handshake,
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
    alwaysOn
  />,
  <SelectInput
    key="interviewType"
    source="interviewType"
    label="Interview Type"
    choices={[
      { id: "video", name: "Video" },
      { id: "in_person", name: "In Person" },
      { id: "extend_offer", name: "Extend Offer" },
    ]}
    alwaysOn
  />,
  <DateInput key="startDate" label="From Date" source="startDate" alwaysOn />,
  <DateInput key="endDate" label="To Date" source="endDate" alwaysOn />,
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

const getInterviewTypeColor = (type: string) => {
  const typeColors: { [key: string]: string } = {
    video: "#2196f3",
    in_person: "#9c27b0",
    extend_offer: "#4caf50",
  };
  return typeColors[type] || "#757575";
};

const formatInterviewType = (type: string) => {
  const typeMap: { [key: string]: string } = {
    video: "Video",
    in_person: "In Person",
    extend_offer: "Extend Offer",
  };
  return typeMap[type] || type || "Video";
};

const getInterviewTypeIcon = (type: string) => {
  switch (type) {
    case "in_person":
      return <LocationOn sx={{ fontSize: 16 }} />;
    case "extend_offer":
      return <Handshake sx={{ fontSize: 16 }} />;
    default:
      return <Videocam sx={{ fontSize: 16 }} />;
  }
};

// Custom exporter for interview audit - matches list view columns
const interviewAuditExporter = (records: any[]) => {
  const headers = [
    "Interviewee",
    "Interviewee Email",
    "Interviewer",
    "Interviewer Email",
    "Job Post",
    "Status",
    "Type",
    "Recording",
    "Duration",
    "Scheduled",
  ];

  const rows = records.map((record) => [
    record.intervieweeName || "N/A",
    record.intervieweeEmail || "",
    record.interviewerName || "N/A",
    record.interviewerEmail || "",
    record.jobTitle || "N/A",
    formatStatus(record.status || ""),
    formatInterviewType(record.interviewType),
    record.recordingUrl ? "Yes" : "No",
    record.durationMinutes ? `${record.durationMinutes} min` : "N/A",
    new Date(record.scheduledAt).toLocaleString(),
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
  URL.revokeObjectURL(url);
};

const ListActions = () => (
  <TopToolbar>
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
    storeKey={false}
  >
    <Datagrid
      rowClick="show"
      bulkActionButtons={false}
      sx={{ tableLayout: "fixed", width: "100%" }}
    >
      <FunctionField
        label="Interviewee"
        sx={{ width: 200, minWidth: 200, maxWidth: 200 }}
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 36, height: 36, flexShrink: 0 }}>
              {record.intervieweeName?.[0]}
            </Avatar>
            <Box sx={{ overflow: "hidden" }}>
              <Typography variant="body2" fontWeight={500} noWrap>
                {record.intervieweeName || "N/A"}
              </Typography>
              <Typography variant="caption" color="textSecondary" noWrap>
                {record.intervieweeEmail || ""}
              </Typography>
            </Box>
          </Box>
        )}
      />
      <FunctionField
        label="Interviewer"
        sx={{ width: 200, minWidth: 200, maxWidth: 200 }}
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 36, height: 36, flexShrink: 0 }}>
              {record.interviewerName?.[0]}
            </Avatar>
            <Box sx={{ overflow: "hidden" }}>
              <Typography variant="body2" fontWeight={500} noWrap>
                {record.interviewerName || "N/A"}
              </Typography>
              <Typography variant="caption" color="textSecondary" noWrap>
                {record.interviewerEmail || ""}
              </Typography>
            </Box>
          </Box>
        )}
      />
      <FunctionField
        label="Job Post"
        sx={{ width: 180, minWidth: 180, maxWidth: 180 }}
        render={(record: any) => (
          <Typography variant="body2" noWrap>
            {record.jobTitle || "N/A"}
          </Typography>
        )}
      />
      <FunctionField
        label="Status"
        sx={{ width: 120, minWidth: 120, maxWidth: 120 }}
        render={(record: any) => <EnhancedChip status={record.status} />}
      />
      <FunctionField
        label="Type"
        sx={{ width: 130, minWidth: 130, maxWidth: 130 }}
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            {getInterviewTypeIcon(record.interviewType)}
            <Chip
              label={formatInterviewType(record.interviewType)}
              size="small"
              sx={{
                bgcolor: getInterviewTypeColor(record.interviewType),
                color: "white",
              }}
            />
          </Box>
        )}
      />
      <FunctionField
        label="Recording"
        sx={{ width: 100, minWidth: 100, maxWidth: 100 }}
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
        sx={{ width: 90, minWidth: 90, maxWidth: 90 }}
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
        sx={{ width: 140, minWidth: 140, maxWidth: 140 }}
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography
              variant="body2"
              noWrap
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

                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="body2">
                    <strong>Interview Type:</strong>
                  </Typography>
                  {getInterviewTypeIcon(record.interviewType)}
                  <Chip
                    label={formatInterviewType(record.interviewType)}
                    size="small"
                    sx={{
                      bgcolor: getInterviewTypeColor(record.interviewType),
                      color: "white",
                    }}
                  />
                  {record.isExtendOffer && (
                    <Chip
                      label="Offer Meeting"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Box>

                {record.location && (
                  <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                    <LocationOn
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      <strong>Location:</strong> {record.location}
                    </Typography>
                  </Box>
                )}

                {record.roomId && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Room ID:</strong> {record.roomId}
                  </Typography>
                )}

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
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
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
