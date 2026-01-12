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
  NumberInput,
  ShowButton,
  FilterButton,
  TopToolbar,
  ExportButton,
} from "react-admin";
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
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Star as StarIcon,
  Note as NoteIcon,
  ChangeCircle as ChangeCircleIcon,
  CalendarToday,
  Videocam,
} from "@mui/icons-material";
import { EnhancedChip } from "../components/shared/EnhancedChip";
import { formatRelativeTime } from "../utils/dateFormatters";

const UpdateNotesButton = ({ record }: any) => {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(record.notes || "");
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleSave = async () => {
    try {
      await dataProvider.update("adminApplications", {
        id: record.id,
        data: { notes },
        previousData: record,
      });
      notify("Notes updated successfully", { type: "success" });
      setOpen(false);
      refresh();
    } catch (error: any) {
      notify(`Error: ${error.message}`, { type: "error" });
    }
  };

  return (
    <>
      <RAButton
        label="Notes"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <NoteIcon />
      </RAButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Update Admin Notes</DialogTitle>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <MUITextField
            label="Notes"
            multiline
            rows={6}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
              handleSave();
            }}
            variant="contained"
            color="primary"
            startIcon={<NoteIcon />}
          >
            Save Notes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const UpdateRatingButton = ({ record }: any) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(record.rating || 0);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleSave = async () => {
    try {
      await dataProvider.update("adminApplications", {
        id: record.id,
        data: { rating },
        previousData: record,
      });
      notify("Rating updated successfully", { type: "success" });
      setOpen(false);
      refresh();
    } catch (error: any) {
      notify(`Error: ${error.message}`, { type: "error" });
    }
  };

  return (
    <>
      <RAButton
        label="Rate"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <StarIcon />
      </RAButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Rate Application</DialogTitle>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <Box display="flex" flexDirection="column" alignItems="center" py={3}>
            <Typography variant="body1" gutterBottom>
              Rate this application (0-5 stars)
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue || 0)}
              size="large"
              sx={{ mt: 2 }}
            />
            <Typography variant="h4" sx={{ mt: 2 }}>
              {rating} / 5
            </Typography>
          </Box>
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
              handleSave();
            }}
            variant="contained"
            color="primary"
            startIcon={<StarIcon />}
          >
            Save Rating
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const UpdateStatusButton = ({ record }: any) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(record.status || "pending");
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleSave = async () => {
    try {
      await dataProvider.update("adminApplications", {
        id: record.id,
        data: { status },
        previousData: record,
      });
      notify("Status updated successfully", { type: "success" });
      setOpen(false);
      refresh();
    } catch (error: any) {
      notify(`Error: ${error.message}`, { type: "error" });
    }
  };

  return (
    <>
      <RAButton
        label="Status"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <ChangeCircleIcon />
      </RAButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_queue">In Queue</MenuItem>
              <MenuItem value="reviewed">Reviewed</MenuItem>
              <MenuItem value="shortlisted">Shortlisted</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="hired">Hired</MenuItem>
            </Select>
          </FormControl>
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
              handleSave();
            }}
            variant="contained"
            color="primary"
            startIcon={<ChangeCircleIcon />}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const applicationFilters = [
  <TextInput key="search" label="Search" source="search" alwaysOn />,
  <SelectInput
    key="status"
    source="status"
    choices={[
      { id: "pending", name: "Pending" },
      { id: "in_queue", name: "In Queue" },
      { id: "reviewed", name: "Reviewed" },
      { id: "shortlisted", name: "Shortlisted" },
      { id: "rejected", name: "Rejected" },
      { id: "hired", name: "Hired" },
    ]}
  />,
  <NumberInput key="minRating" label="Min Rating" source="minRating" />,
];

const getStatusColor = (status: string) => {
  const statusColors: { [key: string]: string } = {
    pending: "#ff9800",
    in_queue: "#2196f3",
    reviewed: "#9c27b0",
    shortlisted: "#4caf50",
    rejected: "#f44336",
    hired: "#00c853",
  };
  return statusColors[status] || "#757575";
};

const formatStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: "Pending",
    in_queue: "In Queue",
    reviewed: "Reviewed",
    shortlisted: "Shortlisted",
    rejected: "Rejected",
    hired: "Hired",
  };
  return statusMap[status] || status;
};

// Custom exporter for applications
const applicationExporter = (records: any[]) => {
  const headers = [
    "Applicant Name",
    "Applicant Email",
    "Job Title",
    "Status",
    "Rating",
    "Has Video",
    "Has Feedback",
    "Interview Count",
    "Applied",
    "Reviewed",
  ];

  const rows = records.map((record) => [
    record.applicantName || "",
    record.applicantEmail || "",
    record.jobTitle || "",
    formatStatus(record.status || ""),
    record.rating || "Not rated",
    record.hasVideo ? "Yes" : "No",
    record.hasFeedback ? "Yes" : "No",
    record.interviewCount || 0,
    new Date(record.appliedAt).toLocaleString(),
    record.reviewedAt
      ? new Date(record.reviewedAt).toLocaleString()
      : "Not reviewed",
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
    `applications-${new Date().toISOString().split("T")[0]}.csv`
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

export const AdminApplicationList = () => (
  <List
    filters={applicationFilters}
    actions={<ListActions />}
    sort={{ field: "appliedAt", order: "DESC" }}
    exporter={applicationExporter}
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
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {record.applicantName || "N/A"}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {record.applicantEmail || ""}
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
          <Typography variant="body2">{record.jobTitle || "N/A"}</Typography>
        )}
      />
      <FunctionField
        label="Status"
        sortable
        sortBy="status"
        render={(record: any) => <EnhancedChip status={record.status} />}
      />
      <FunctionField
        label="Rating"
        sortable
        sortBy="rating"
        render={(record: any) =>
          record.rating ? (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Rating value={record.rating} readOnly size="small" />
              <Typography variant="body2">({record.rating})</Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Not rated
            </Typography>
          )
        }
      />
      <FunctionField
        label="Has Video"
        sortable
        sortBy="hasVideo"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            {record.hasVideo && (
              <Videocam sx={{ fontSize: 18, color: "#4caf50" }} />
            )}
            <Chip
              label={record.hasVideo ? "Yes" : "No"}
              size="small"
              color={record.hasVideo ? "success" : "default"}
              variant="outlined"
            />
          </Box>
        )}
      />
      <FunctionField
        label="Interviews"
        sortable
        sortBy="interviewCount"
        render={(record: any) => (
          <Typography variant="body2">{record.interviewCount || 0}</Typography>
        )}
      />
      <FunctionField
        label="Applied"
        sortable
        sortBy="appliedAt"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography
              variant="body2"
              title={new Date(record.appliedAt).toLocaleString()}
            >
              {formatRelativeTime(record.appliedAt)}
            </Typography>
          </Box>
        )}
      />
      <FunctionField
        label="Admin Actions"
        render={(record: any) => (
          <Box display="flex" gap={1}>
            <ShowButton />
            {/* <UpdateNotesButton record={record} /> */}
            <UpdateRatingButton record={record} />
            <UpdateStatusButton record={record} />
          </Box>
        )}
      />
    </Datagrid>
  </List>
);

export const AdminApplicationShow = () => (
  <Show>
    <TabbedShowLayout>
      <Tab label="Overview">
        <FunctionField
          label=""
          render={(record: any) => (
            <Box>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">Applicant Information</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                      src={record.applicantProfileImage}
                      sx={{ width: 64, height: 64 }}
                    >
                      {record.applicantName?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {record.applicantName || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {record.applicantEmail || ""}
                      </Typography>
                      {/* <Typography variant="caption" color="textSecondary">
                        User ID: {record.applicantId}
                      </Typography> */}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">Job Post</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body1">
                    {record.jobTitle || "N/A"}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Job Post ID: {record.jobPostId}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">Application Status</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Chip
                    label={formatStatus(record.status)}
                    sx={{
                      mr: 1,
                      bgcolor: getStatusColor(record.status),
                      color: "white",
                    }}
                  />
                  {record.rating && (
                    <Box display="inline-flex" alignItems="center" gap={1}>
                      <Rating value={record.rating} readOnly size="small" />
                      <Typography variant="body2">
                        ({record.rating}/5)
                      </Typography>
                    </Box>
                  )}
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Applied: {new Date(record.appliedAt).toLocaleString()}
                  </Typography>
                  {record.reviewedAt && (
                    <Typography variant="body2">
                      Reviewed: {new Date(record.reviewedAt).toLocaleString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {record.notes && (
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Admin Notes</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {record.notes}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
        />
      </Tab>

      <Tab label="Main Video">
        <FunctionField
          label=""
          render={(record: any) => (
            <Box>
              {record.mainVideoUrl ? (
                <Card>
                  <CardContent>
                    <Typography variant="h6">Main Application Video</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box mb={2}>
                      <video
                        src={record.mainVideoUrl}
                        controls
                        poster={record.thumbnailUrl}
                        style={{
                          width: "100%",
                          maxWidth: 800,
                          marginTop: 8,
                          borderRadius: 8,
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Typography color="textSecondary">
                  No main video submission
                </Typography>
              )}
            </Box>
          )}
        />
      </Tab>

      <Tab label="Answers">
        <FunctionField
          label=""
          render={(record: any) => (
            <Box>
              {record.answers && record.answers.length > 0 ? (
                record.answers.map((answer: any, index: number) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">Answer {index + 1}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2">
                        Type: <Chip label={answer.answerType} size="small" />
                      </Typography>
                      {answer.answerUrl && answer.answerType === "video" && (
                        <Box mt={2}>
                          <video
                            src={answer.answerUrl}
                            controls
                            style={{ width: "100%", maxWidth: 600 }}
                          />
                        </Box>
                      )}
                      {answer.answerUrl && answer.answerType === "audio" && (
                        <Box mt={2}>
                          <audio
                            src={answer.answerUrl}
                            controls
                            style={{ width: "100%", maxWidth: 600 }}
                          />
                        </Box>
                      )}
                      {answer.transcription && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Transcription:</strong> {answer.transcription}
                        </Typography>
                      )}
                      {answer.duration && (
                        <Typography variant="caption" color="textSecondary">
                          Duration: {answer.duration}s
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography color="textSecondary">No answers yet</Typography>
              )}
            </Box>
          )}
        />
      </Tab>

      <Tab label="Rejection Feedback">
        <FunctionField
          label=""
          render={(record: any) => (
            <Box>
              {record.rejectionFeedback ? (
                <Card>
                  <CardContent>
                    <Typography variant="h6">Rejection Feedback</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {record.rejectionFeedback}
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <Typography color="textSecondary">
                  No rejection feedback
                </Typography>
              )}
            </Box>
          )}
        />
      </Tab>

      <Tab label="Interviews">
        <FunctionField
          label=""
          render={(record: any) => (
            <Box>
              {record.interviews && record.interviews.length > 0 ? (
                record.interviews.map((interview: any, index: number) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">
                        Interview {index + 1}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2">
                        Status: <Chip label={interview.status} size="small" />
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Scheduled:{" "}
                        {new Date(interview.scheduledAt).toLocaleString()}
                      </Typography>
                      {interview.recordingUrl && (
                        <Typography variant="body2">
                          Recording:{" "}
                          <a
                            href={interview.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography color="textSecondary">No interviews</Typography>
              )}
            </Box>
          )}
        />
      </Tab>
    </TabbedShowLayout>
  </Show>
);

export const adminApplicationResource = {
  list: AdminApplicationList,
  show: AdminApplicationShow,
  icon: AssignmentIcon,
};
