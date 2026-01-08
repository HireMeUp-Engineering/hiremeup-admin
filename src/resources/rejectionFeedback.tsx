import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Show,
  SimpleShowLayout,
  FunctionField,
  TextInput,
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
} from "@mui/material";
import {
  Feedback as FeedbackIcon,
  CalendarToday,
  Videocam,
  Mic,
} from "@mui/icons-material";
import { EnhancedChip } from "../components/shared/EnhancedChip";
import { formatRelativeTime } from "../utils/dateFormatters";

const rejectionFilters = [
  <TextInput key="search" label="Search" source="search" alwaysOn />,
  <DateInput key="startDate" label="From Date" source="startDate" />,
  <DateInput key="endDate" label="To Date" source="endDate" />,
];

const formatScreeningType = (type: string) => {
  const typeMap: { [key: string]: string } = {
    video: "Video",
    audio: "Audio",
    text: "Text",
    main_screening: "Main Screening",
    question_response: "Question Response",
  };
  return typeMap[type] || type;
};

// Custom exporter for rejection feedback
const rejectionFeedbackExporter = (records: any[]) => {
  const headers = [
    "Applicant Name",
    "Job Title",
    "Screening Type",
    "Rejection Reason",
    "Has Video",
    "Has Audio",
    "Rejected On",
  ];

  const rows = records.map((record) => [
    record.applicantName || "N/A",
    record.jobTitle || "N/A",
    formatScreeningType(record.screeningType || ""),
    record.responseText || "",
    record.responseVideoUrl ? "Yes" : "No",
    record.responseAudioUrl ? "Yes" : "No",
    new Date(record.createdAt).toLocaleString(),
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
    `rejection-feedback-${new Date().toISOString().split("T")[0]}.csv`
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

export const RejectionFeedbackList = () => (
  <List
    filters={rejectionFilters}
    actions={<ListActions />}
    sort={{ field: "createdAt", order: "DESC" }}
    exporter={rejectionFeedbackExporter}
    perPage={20}
  >
    <Datagrid rowClick="show">
      <FunctionField
        label="Applicant"
        sortable
        sortBy="applicantName"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 36, height: 36 }}>
              {record.applicantName?.[0]}
            </Avatar>
            <Typography variant="body2" fontWeight={500}>
              {record.applicantName || "N/A"}
            </Typography>
          </Box>
        )}
      />
      <FunctionField
        label="Job Post"
        sortable
        sortBy="jobTitle"
        render={(record: any) => (
          <Typography variant="body2">{record.jobTitle || "N/A"}</Typography>
        )}
      />
      <FunctionField
        label="Screening Type"
        sortable
        sortBy="screeningType"
        render={(record: any) => (
          <EnhancedChip
            status={
              record.screeningType === "video" ||
              record.screeningType === "audio"
                ? "in_review"
                : "pending"
            }
            label={formatScreeningType(record.screeningType)}
          />
        )}
      />
      <FunctionField
        label="Reason"
        render={(record: any) => (
          <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
            {record.responseText || "N/A"}
          </Typography>
        )}
      />
      <FunctionField
        label="Has Media"
        render={(record: any) => (
          <Box display="flex" gap={0.5} alignItems="center">
            {record.responseVideoUrl && (
              <>
                <Videocam sx={{ fontSize: 18, color: "#4caf50" }} />
                <Chip
                  label="Video"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </>
            )}
            {record.responseAudioUrl && (
              <>
                <Mic sx={{ fontSize: 18, color: "#2196f3" }} />
                <Chip
                  label="Audio"
                  size="small"
                  color="info"
                  variant="outlined"
                />
              </>
            )}
            {!record.responseVideoUrl && !record.responseAudioUrl && (
              <Typography variant="caption" color="textSecondary">
                None
              </Typography>
            )}
          </Box>
        )}
      />
      <FunctionField
        label="Rejected On"
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
      <ShowButton />
    </Datagrid>
  </List>
);

export const RejectionFeedbackShow = () => (
  <Show>
    <SimpleShowLayout>
      <FunctionField
        label=""
        render={(record: any) => (
          <Box>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Applicant</Typography>
                <Box mt={2}>
                  <Typography variant="h6">
                    {record.applicantName || "N/A"}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    User ID: {record.applicantUserId}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Job Post</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {record.jobTitle || "N/A"}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Job Post ID: {record.jobPostId}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Rejection Information</Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Screening Type:</strong>{" "}
                    <Chip
                      label={formatScreeningType(record.screeningType)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Rejected On:</strong>{" "}
                    {new Date(record.createdAt).toLocaleString()}
                  </Typography>
                  {record.title && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Title:</strong> {record.title}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Rejection Reason</Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                >
                  {record.responseText || "No reason provided"}
                </Typography>
              </CardContent>
            </Card>

            {(record.responseVideoUrl || record.responseAudioUrl) && (
              <Card>
                <CardContent>
                  <Typography variant="h6">Media Response</Typography>
                  {record.responseVideoUrl && (
                    <Box sx={{ mt: 2 }}>
                      <video
                        src={record.responseVideoUrl}
                        controls
                        poster={record.responseThumbnailUrl}
                        style={{
                          width: "100%",
                          maxWidth: 800,
                          borderRadius: 8,
                        }}
                      />
                    </Box>
                  )}
                  {record.responseAudioUrl && !record.responseVideoUrl && (
                    <Box sx={{ mt: 2 }}>
                      <audio
                        src={record.responseAudioUrl}
                        controls
                        style={{ width: "100%" }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      />
    </SimpleShowLayout>
  </Show>
);

export const rejectionFeedbackResource = {
  list: RejectionFeedbackList,
  show: RejectionFeedbackShow,
  icon: FeedbackIcon,
};
