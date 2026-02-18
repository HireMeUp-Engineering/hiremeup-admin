import React, { useState } from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Edit,
  SimpleForm,
  SelectInput,
  TextInput,
  Show,
  SimpleShowLayout,
  FunctionField,
  ChipField,
  useNotify,
  useRefresh,
  Button as RAButton,
  DeleteButton,
  EditButton,
  ShowButton,
} from "react-admin";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List as MUIList,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import {
  Queue as QueueIcon,
  Send as SendIcon,
  CalendarToday,
} from "@mui/icons-material";
import { EnhancedChip } from "../components/shared/EnhancedChip";
import { formatRelativeTime } from "../utils/dateFormatters";
import { Avatar } from "@mui/material";

function getAuthToken(): string | null {
  try {
    const auth = localStorage.getItem("auth");
    if (!auth) return null;
    const parsed = JSON.parse(auth);
    return parsed?.token || null;
  } catch {
    localStorage.removeItem("auth");
    return null;
  }
}

const SendQuestionButton = ({ record }: any) => {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();

  const handleOpen = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) return;
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/queue/${
          record.id
        }/next-step`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setQuestions(data.questions || []);
      setOpen(true);
    } catch (error: any) {
      notify(`Error loading questions: ${error.message}`, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!selectedQuestion) {
      notify("Please select a question", { type: "warning" });
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) return;
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL
        }/queue/send-question`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            queueId: record.id,
            questionId: selectedQuestion,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send question");
      }

      notify("Question sent successfully!", { type: "success" });
      setOpen(false);
      refresh();
    } catch (error: any) {
      notify(`Error sending question: ${error.message}`, { type: "error" });
    }
  };

  return (
    <>
      <RAButton
        label="Send Question"
        onClick={handleOpen}
        disabled={loading || record.status === "awaiting_response"}
      >
        <SendIcon />
      </RAButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Send Question to Applicant</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" paragraph>
            Select a question to send to{" "}
            {record.application?.applicant?.firstName}{" "}
            {record.application?.applicant?.lastName}
          </Typography>

          <MUIList>
            {questions.map((question, index) => (
              <ListItem
                key={question.id}
                disablePadding
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemButton
                  selected={selectedQuestion === question.id}
                  onClick={() => setSelectedQuestion(question.id)}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#e3f2fd",
                      borderColor: "#2196f3",
                    },
                  }}
                >
                  <ListItemText
                    primary={`Question ${index + 1}: ${question.questionType}`}
                    secondary={question.questionText || question.title}
                  />
                  <Chip
                    label={question.responseType}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </MUIList>

          {questions.length === 0 && (
            <Typography color="textSecondary" align="center" py={3}>
              No questions available for this job post
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSend}
            variant="contained"
            color="primary"
            disabled={!selectedQuestion}
            startIcon={<SendIcon />}
          >
            Send Question
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const queueFilters = [
  <SelectInput
    key="status"
    source="status"
    choices={[
      { id: "queued", name: "Queued" },
      { id: "in_review", name: "In Review" },
      { id: "awaiting_response", name: "Awaiting Response" },
      { id: "completed", name: "Completed" },
      { id: "removed", name: "Removed" },
    ]}
    alwaysOn
  />,
];

export const QueueList = () => (
  <List filters={queueFilters} sort={{ field: "position", order: "ASC" }} storeKey={false}>
    <Datagrid rowClick="show" sx={{ tableLayout: "fixed", width: "100%" }}>
      <FunctionField
        label="Position"
        sx={{ width: 80, minWidth: 80, maxWidth: 80 }}
        render={(record: any) => (
          <Typography variant="body2">{record.position}</Typography>
        )}
      />
      <FunctionField
        label="Applicant"
        sx={{ width: 180, minWidth: 180, maxWidth: 180 }}
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 36, height: 36, flexShrink: 0 }}>
              {record.application?.applicant?.firstName?.[0]}
            </Avatar>
            <Box sx={{ overflow: "hidden" }}>
              <Typography variant="body2" fontWeight={500} noWrap>
                {`${record.application?.applicant?.firstName || ""} ${
                  record.application?.applicant?.lastName || ""
                }`.trim() || "N/A"}
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
            {record.application?.jobPost?.jobTitle || "N/A"}
          </Typography>
        )}
      />
      <FunctionField
        label="Status"
        sortable
        sortBy="status"
        sx={{ width: 140, minWidth: 140, maxWidth: 140 }}
        render={(record: any) => <EnhancedChip status={record.status} />}
      />
      <FunctionField
        label="Queued At"
        sortable
        sortBy="queuedAt"
        sx={{ width: 130, minWidth: 130, maxWidth: 130 }}
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography
              variant="body2"
              noWrap
              title={new Date(record.queuedAt).toLocaleString()}
            >
              {formatRelativeTime(record.queuedAt)}
            </Typography>
          </Box>
        )}
      />
      <FunctionField
        label="Reviewed At"
        sortable
        sortBy="reviewedAt"
        sx={{ width: 130, minWidth: 130, maxWidth: 130 }}
        render={(record: any) =>
          record.reviewedAt ? (
            <Box display="flex" alignItems="center" gap={0.5}>
              <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography
                variant="body2"
                noWrap
                title={new Date(record.reviewedAt).toLocaleString()}
              >
                {formatRelativeTime(record.reviewedAt)}
              </Typography>
            </Box>
          ) : (
            <Typography variant="caption" color="textSecondary">
              Not reviewed
            </Typography>
          )
        }
      />
      <FunctionField
        label="Actions"
        sx={{ width: 220, minWidth: 220, maxWidth: 220 }}
        render={(record: any) => (
          <Box display="flex" gap={1}>
            <SendQuestionButton record={record} />
            <ShowButton />
            <EditButton />
            <DeleteButton />
          </Box>
        )}
      />
    </Datagrid>
  </List>
);

export const QueueShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="position" label="Position in Queue" />
      <ChipField source="status" label="Status" />
      <FunctionField
        label="Applicant"
        render={(record: any) => (
          <Box>
            <Typography variant="body1">
              {record.application?.applicant?.firstName}{" "}
              {record.application?.applicant?.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {record.application?.applicant?.email}
            </Typography>
          </Box>
        )}
      />
      <FunctionField
        label="Job Post"
        render={(record: any) => (
          <Typography variant="body1">
            {record.application?.jobPost?.jobTitle}
          </Typography>
        )}
      />
      <TextField source="notes" />
      <DateField source="queuedAt" label="Queued At" showTime />
      <DateField source="reviewedAt" label="Reviewed At" showTime />

      <FunctionField
        label="Application Details"
        render={(record: any) => (
          <Box>
            <Typography variant="subtitle2">
              Status: {record.application?.status}
            </Typography>
            <Typography variant="subtitle2">
              Applied:{" "}
              {new Date(record.application?.appliedAt).toLocaleString()}
            </Typography>
            {record.application?.rating && (
              <Typography variant="subtitle2">
                Rating: {record.application.rating}/5
              </Typography>
            )}
          </Box>
        )}
      />
    </SimpleShowLayout>
  </Show>
);

export const QueueEdit = () => (
  <Edit>
    <SimpleForm>
      <SelectInput
        source="status"
        choices={[
          { id: "queued", name: "Queued" },
          { id: "in_review", name: "In Review" },
          { id: "awaiting_response", name: "Awaiting Response" },
          { id: "completed", name: "Completed" },
          { id: "removed", name: "Removed" },
        ]}
      />
      <TextInput source="notes" multiline rows={4} fullWidth />
      <TextInput source="position" type="number" />
    </SimpleForm>
  </Edit>
);

export const queueResource = {
  list: QueueList,
  show: QueueShow,
  edit: QueueEdit,
  icon: QueueIcon,
};
