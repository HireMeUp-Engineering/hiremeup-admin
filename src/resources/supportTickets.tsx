import React, { useState } from "react";
import {
  List,
  Datagrid,
  TextField,
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
  TopToolbar,
  ExportButton,
  ShowButton,
} from "react-admin";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  TextField as MUITextField,
  Avatar,
  Link as MUILink,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  SupportAgent as SupportIcon,
  CheckCircle as ResolvedIcon,
  HourglassEmpty as PendingIcon,
  PlayArrow as InProgressIcon,
  Close as ClosedIcon,
  Flag as PriorityIcon,
  Image as ImageIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { formatRelativeTime } from "../utils/dateFormatters";

// Filters for the ticket list
const ticketFilters = [
  <TextInput key="search" label="Search" source="search" alwaysOn />,
  <SelectInput
    key="status"
    source="status"
    choices={[
      { id: "pending", name: "Pending" },
      { id: "in_progress", name: "In Progress" },
      { id: "resolved", name: "Resolved" },
      { id: "closed", name: "Closed" },
    ]}
    alwaysOn
  />,
  <SelectInput
    key="category"
    source="category"
    choices={[
      { id: "technical", name: "Technical" },
      { id: "account", name: "Account" },
      { id: "application_job", name: "Application/Job" },
      { id: "general", name: "General" },
    ]}
    alwaysOn
  />,
  <SelectInput
    key="priority"
    source="priority"
    choices={[
      { id: "low", name: "Low" },
      { id: "medium", name: "Medium" },
      { id: "high", name: "High" },
      { id: "urgent", name: "Urgent" },
    ]}
    alwaysOn
  />,
];

// Format status for display
const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <PendingIcon sx={{ fontSize: 16 }} />;
    case "in_progress":
      return <InProgressIcon sx={{ fontSize: 16 }} />;
    case "resolved":
      return <ResolvedIcon sx={{ fontSize: 16 }} />;
    case "closed":
      return <ClosedIcon sx={{ fontSize: 16 }} />;
    default:
      return undefined;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "in_progress":
      return "info";
    case "resolved":
      return "success";
    case "closed":
      return "default";
    default:
      return "default";
  }
};

const getPriorityColor = (priority: string | null) => {
  if (!priority) return "default";
  switch (priority) {
    case "low":
      return "success";
    case "medium":
      return "info";
    case "high":
      return "warning";
    case "urgent":
      return "error";
    default:
      return "default";
  }
};

// Update Status Button Component
const UpdateStatusButton = ({ record }: any) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(record?.status || "pending");
  const [resolutionMessage, setResolutionMessage] = useState("");
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleUpdate = async () => {
    try {
      if (status === "resolved" && !resolutionMessage.trim()) {
        notify("Resolution message is required when resolving a ticket", {
          type: "error",
        });
        return;
      }

      await dataProvider.update("supportTickets", {
        id: record.id,
        data: {
          action: "updateStatus",
          status,
          resolutionMessage: resolutionMessage || undefined,
        },
        previousData: record,
      });

      notify("Ticket status updated successfully", { type: "success" });
      setOpen(false);
      refresh();
    } catch (error: any) {
      notify(`Error: ${error.message}`, { type: "error" });
    }
  };

  return (
    <>
      <RAButton
        label="Update Status"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Update Ticket Status</DialogTitle>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>

            {status === "resolved" && (
              <MUITextField
                fullWidth
                multiline
                rows={4}
                label="Resolution Message (Required)"
                value={resolutionMessage}
                onChange={(e) => setResolutionMessage(e.target.value)}
                placeholder="Explain how the issue was resolved..."
                required
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions onClick={(e) => e.stopPropagation()}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Update Priority Button Component
const UpdatePriorityButton = ({ record }: any) => {
  const [open, setOpen] = useState(false);
  const [priority, setPriority] = useState(record?.priority || "medium");
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleUpdate = async () => {
    try {
      await dataProvider.update("supportTickets", {
        id: record.id,
        data: {
          action: "updatePriority",
          priority,
        },
        previousData: record,
      });

      notify("Ticket priority updated successfully", { type: "success" });
      setOpen(false);
      refresh();
    } catch (error: any) {
      notify(`Error: ${error.message}`, { type: "error" });
    }
  };

  return (
    <>
      <RAButton
        label="Set Priority"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <PriorityIcon />
      </RAButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Set Ticket Priority</DialogTitle>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions onClick={(e) => e.stopPropagation()}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// List Actions
const ListActions = () => (
  <TopToolbar>
    <ExportButton />
  </TopToolbar>
);

// Support Ticket List
export const SupportTicketList = () => (
  <List
    filters={ticketFilters}
    actions={<ListActions />}
    sort={{ field: "createdAt", order: "DESC" }}
    perPage={25}
    storeKey={false}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <FunctionField
        label="User"
        render={(record: any) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
              <PersonIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {record.userName || "Unknown"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {record.userEmail || "No email"}
              </Typography>
            </Box>
          </Box>
        )}
      />

      <FunctionField
        label="Title"
        render={(record: any) => (
          <Typography variant="body2" fontWeight={600}>
            {record.title}
          </Typography>
        )}
      />

      <FunctionField
        label="Category"
        render={(record: any) => (
          <Chip
            label={record.category?.replace("_", " ") || "N/A"}
            size="small"
            variant="outlined"
          />
        )}
      />

      <FunctionField
        label="Status"
        render={(record: any) => (
          <Chip
            icon={getStatusIcon(record.status)}
            label={record.status.replace("_", " ")}
            color={getStatusColor(record.status) as any}
            size="small"
          />
        )}
      />

      <FunctionField
        label="Priority"
        render={(record: any) =>
          record.priority ? (
            <Chip
              label={record.priority}
              color={getPriorityColor(record.priority) as any}
              size="small"
            />
          ) : (
            <Chip label="Not Set" size="small" variant="outlined" />
          )
        }
      />

      <FunctionField
        label="Created"
        render={(record: any) => (
          <Typography variant="body2" color="text.secondary">
            {formatRelativeTime(record.createdAt)}
          </Typography>
        )}
      />

      <ShowButton />
    </Datagrid>
  </List>
);

// Support Ticket Show
export const SupportTicketShow = () => (
  <Show>
    <TabbedShowLayout>
      <Tab label="Ticket Details">
        <FunctionField
          label="User Information"
          render={(record: any) => (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{ width: 56, height: 56, bgcolor: "primary.main" }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{record.userName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {record.userEmail}
                    </Typography>
                    {/* <Typography variant="caption" color="text.secondary">
                      User ID: {record.userId}
                    </Typography> */}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        />

        <TextField
          source="title"
          label="Title"
          sx={{ fontSize: "1.5rem", fontWeight: 600 }}
        />

        <FunctionField
          label="Category & Status"
          render={(record: any) => (
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Chip
                label={record.category.replace("_", " ")}
                icon={<SupportIcon />}
              />
              <Chip
                icon={getStatusIcon(record.status)}
                label={record.status.replace("_", " ")}
                color={getStatusColor(record.status) as any}
              />
              {record.priority && (
                <Chip
                  label={`Priority: ${record.priority}`}
                  color={getPriorityColor(record.priority) as any}
                />
              )}
            </Box>
          )}
        />

        <FunctionField
          label="Description"
          render={(record: any) => (
            <Card sx={{ mb: 2, bgcolor: "grey.50" }}>
              <CardContent>
                <Typography variant="body1" whiteSpace="pre-wrap">
                  {record.description}
                </Typography>
              </CardContent>
            </Card>
          )}
        />

        <FunctionField
          label="Attachment"
          render={(record: any) =>
            record.attachmentUrl ? (
              <Box sx={{ mb: 2 }}>
                <MUILink
                  href={record.attachmentUrl}
                  target="_blank"
                  rel="noopener"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <ImageIcon />
                  View Attachment
                </MUILink>
                <Box sx={{ mt: 1 }}>
                  <img
                    src={record.attachmentUrl}
                    alt="Ticket attachment"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No attachment
              </Typography>
            )
          }
        />

        <FunctionField
          label="Resolution"
          render={(record: any) =>
            record.resolutionMessage ? (
              <Card
                sx={{
                  mb: 2,
                  bgcolor: "success.50",
                  borderLeft: "4px solid",
                  borderColor: "success.main",
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    color="success.dark"
                    gutterBottom
                  >
                    Admin Response:
                  </Typography>
                  <Typography variant="body1" whiteSpace="pre-wrap">
                    {record.resolutionMessage}
                  </Typography>
                  {record.resolvedByAdminName && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      Resolved by: {record.resolvedByAdminName}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No resolution message yet
              </Typography>
            )
          }
        />

        <FunctionField
          label="Timestamps"
          render={(record: any) => (
            <Box>
              <Typography variant="body2">
                <strong>Created:</strong>{" "}
                {new Date(record.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Updated:</strong>{" "}
                {new Date(record.updatedAt).toLocaleString()}
              </Typography>
              {record.resolvedAt && (
                <Typography variant="body2">
                  <strong>Resolved:</strong>{" "}
                  {new Date(record.resolvedAt).toLocaleString()}
                </Typography>
              )}
            </Box>
          )}
        />
      </Tab>

      <Tab label="Actions">
        <FunctionField
          label="Ticket Management"
          render={(record: any) => (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <UpdateStatusButton record={record} />
              <UpdatePriorityButton record={record} />
            </Box>
          )}
        />
      </Tab>
    </TabbedShowLayout>
  </Show>
);

export const supportTicketResource = {
  list: SupportTicketList,
  show: SupportTicketShow,
  icon: SupportIcon,
};
