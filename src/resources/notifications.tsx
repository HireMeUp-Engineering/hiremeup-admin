import React, { useState, useEffect } from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  useDataProvider,
  useNotify,
  useRefresh,
  TextInput,
  SelectInput,
  FunctionField,
  TopToolbar,
  FilterButton,
  ExportButton,
  Button,
} from "react-admin";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  Preview as PreviewIcon,
  Restore as RestoreIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  PhoneAndroid as PushIcon,
} from "@mui/icons-material";
import { EnhancedChip } from "../components/shared/EnhancedChip";

// ==================== Types ====================

interface NotificationTemplate {
  id: string;
  type: string;
  name: string;
  titleTemplate: string;
  bodyTemplate: string;
  emailSubjectTemplate?: string;
  emailBodyTemplate?: string;
  isActive: boolean;
  variables: string[];
  description?: string;
  createdAt: string;
  lastUpdated: string;
}

// ==================== Tab Panel ====================

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notification-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// ==================== Edit Template Dialog ====================

interface EditTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  template: NotificationTemplate | null;
  onSave: (data: Partial<NotificationTemplate>) => Promise<void>;
}

const EditTemplateDialog: React.FC<EditTemplateDialogProps> = ({
  open,
  onClose,
  template,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    titleTemplate: "",
    bodyTemplate: "",
    emailSubjectTemplate: "",
    emailBodyTemplate: "",
    isActive: true,
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || "",
        titleTemplate: template.titleTemplate || "",
        bodyTemplate: template.bodyTemplate || "",
        emailSubjectTemplate: template.emailSubjectTemplate || "",
        emailBodyTemplate: template.emailBodyTemplate || "",
        isActive: template.isActive,
        description: template.description || "",
      });
    }
  }, [template]);

  const resetForm = () => {
    setFormData({
      name: "",
      titleTemplate: "",
      bodyTemplate: "",
      emailSubjectTemplate: "",
      emailBodyTemplate: "",
      isActive: true,
      description: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
      handleClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit Template: {template?.name}
        <Typography variant="caption" display="block" color="textSecondary">
          Type: {template?.type}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <MuiTextField
            label="Display Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
          />
          <MuiTextField
            label="Push/In-App Title Template"
            value={formData.titleTemplate}
            onChange={(e) =>
              setFormData({ ...formData, titleTemplate: e.target.value })
            }
            fullWidth
            helperText="Use {{variableName}} for dynamic content"
          />
          <MuiTextField
            label="Push/In-App Body Template"
            value={formData.bodyTemplate}
            onChange={(e) =>
              setFormData({ ...formData, bodyTemplate: e.target.value })
            }
            fullWidth
            multiline
            rows={3}
          />
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" color="textSecondary">
            Email Settings
          </Typography>
          <MuiTextField
            label="Email Subject Template"
            value={formData.emailSubjectTemplate}
            onChange={(e) =>
              setFormData({ ...formData, emailSubjectTemplate: e.target.value })
            }
            fullWidth
          />
          <MuiTextField
            label="Custom Email Body HTML (optional)"
            value={formData.emailBodyTemplate}
            onChange={(e) =>
              setFormData({ ...formData, emailBodyTemplate: e.target.value })
            }
            fullWidth
            multiline
            rows={4}
            helperText="Leave empty to use default email template"
          />
          <Divider sx={{ my: 1 }} />
          <MuiTextField
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
            }
            label="Template Active"
          />
          {template?.variables && template.variables.length > 0 && (
            <Box>
              <Typography variant="caption" color="textSecondary">
                Available Variables:
              </Typography>
              <Box
                sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}
              >
                {template.variables.map((v) => (
                  <Chip
                    key={v}
                    label={`{{${v}}}`}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} label="Cancel" />
        <Button
          onClick={handleSave}
          disabled={saving}
          label={saving ? "Saving..." : "Save Changes"}
        />
      </DialogActions>
    </Dialog>
  );
};

// ==================== Preview Dialog ====================

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  template: NotificationTemplate | null;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({
  open,
  onClose,
  template,
}) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [sampleData, setSampleData] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<{
    title: string;
    body: string;
    emailSubject: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPreview(null);
    if (template?.variables) {
      const defaultData: Record<string, string> = {};
      template.variables.forEach((v) => {
        if (v === "applicantName") defaultData[v] = "John Doe";
        else if (v === "jobTitle") defaultData[v] = "Software Engineer";
        else if (v === "companyName") defaultData[v] = "TechCorp Inc.";
        else if (v === "interviewDate") defaultData[v] = "January 15, 2025";
        else if (v === "interviewTime") defaultData[v] = "2:00 PM";
        else defaultData[v] = `[${v}]`;
      });
      setSampleData(defaultData);
    }
  }, [template]);

  const handlePreview = async () => {
    if (!template) return;
    setLoading(true);
    try {
      const response = await dataProvider.create(
        "notificationTemplatePreview",
        {
          data: {
            type: template.type,
            sampleData,
          },
        }
      );
      setPreview(response.data as any);
    } catch (error: any) {
      notify(`Failed to generate preview: ${error?.message || "Unknown error"}`, { type: "error" });
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Preview Template: {template?.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Sample Data
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(sampleData).map(([key, value]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={key}>
                <MuiTextField
                  label={key}
                  value={value}
                  onChange={(e) =>
                    setSampleData({ ...sampleData, [key]: e.target.value })
                  }
                  size="small"
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button
              onClick={handlePreview}
              disabled={loading}
              label={loading ? "Generating..." : "Generate Preview"}
            >
              <PreviewIcon />
            </Button>
          </Box>
          {preview && (
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="primary">
                Push/In-App Notification
              </Typography>
              <Typography variant="h6">{preview.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                {preview.body}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="primary">
                Email Subject
              </Typography>
              <Typography variant="body1">{preview.emailSubject}</Typography>
            </Paper>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} label="Close" />
      </DialogActions>
    </Dialog>
  );
};

// ==================== Send Notification Dialog ====================

interface SendNotificationDialogProps {
  open: boolean;
  onClose: () => void;
}

const SendNotificationDialog: React.FC<SendNotificationDialogProps> = ({
  open,
  onClose,
}) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    target: "all",
    role: "",
    userIds: "",
    sendEmail: true,
    sendPush: true,
  });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    sent: number;
    failed: number;
    total: number;
  } | null>(null);

  const handleSend = async () => {
    if (!formData.title || !formData.body) {
      notify("Title and body are required", { type: "warning" });
      return;
    }

    if (formData.target === "role" && !formData.role) {
      notify("Please select a role", { type: "warning" });
      return;
    }

    if (formData.target === "specific" && !formData.userIds.trim()) {
      notify("Please enter user IDs", { type: "warning" });
      return;
    }

    if (!formData.sendEmail && !formData.sendPush) {
      notify("At least one delivery channel (Email or Push) must be enabled", { type: "warning" });
      return;
    }

    setSending(true);
    setResult(null);
    try {
      const payload: any = {
        title: formData.title,
        body: formData.body,
        target: formData.target,
        sendEmail: formData.sendEmail,
        sendPush: formData.sendPush,
      };

      if (formData.target === "role") {
        payload.role = formData.role;
      } else if (formData.target === "specific") {
        payload.userIds = formData.userIds.split(",").map((id) => id.trim());
      }

      const response = await dataProvider.create("notificationSend", {
        data: payload,
      });

      const data = response.data as any;
      setResult({
        sent: data.sent,
        failed: data.failed,
        total: data.totalTargeted,
      });
      notify("Notification sent successfully", { type: "success" });
    } catch (error: any) {
      notify(`Error: ${error.message}`, { type: "error" });
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      body: "",
      target: "all",
      role: "",
      userIds: "",
      sendEmail: true,
      sendPush: true,
    });
    setResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <SendIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Send Notification
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <MuiTextField
            label="Notification Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            fullWidth
            required
          />
          <MuiTextField
            label="Notification Body"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            fullWidth
            multiline
            rows={3}
            required
          />
          <FormControl fullWidth>
            <InputLabel>Target Audience</InputLabel>
            <Select
              value={formData.target}
              onChange={(e) =>
                setFormData({ ...formData, target: e.target.value })
              }
              label="Target Audience"
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="role">By Role</MenuItem>
              <MenuItem value="specific">Specific Users</MenuItem>
            </Select>
          </FormControl>
          {formData.target === "role" && (
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                label="Role"
              >
                <MenuItem value="JOB_SEEKER">Job Seekers</MenuItem>
                <MenuItem value="JOB_POSTER">Job Posters</MenuItem>
              </Select>
            </FormControl>
          )}
          {formData.target === "specific" && (
            <MuiTextField
              label="User IDs (comma-separated)"
              value={formData.userIds}
              onChange={(e) =>
                setFormData({ ...formData, userIds: e.target.value })
              }
              fullWidth
              helperText="Enter user UUIDs separated by commas"
            />
          )}
          <Divider />
          <Typography variant="subtitle2">Delivery Channels</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.sendEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, sendEmail: e.target.checked })
                  }
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <EmailIcon fontSize="small" /> Email
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.sendPush}
                  onChange={(e) =>
                    setFormData({ ...formData, sendPush: e.target.checked })
                  }
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PushIcon fontSize="small" /> Push
                </Box>
              }
            />
          </Box>
          {result && (
            <Alert severity={result.failed > 0 ? "warning" : "success"}>
              Sent to {result.sent} of {result.total} users.
              {result.failed > 0 && ` (${result.failed} failed)`}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} label="Close" />
        <Button
          onClick={handleSend}
          disabled={sending}
          label={sending ? "Sending..." : "Send Notification"}
        />
      </DialogActions>
    </Dialog>
  );
};

// ==================== Templates List ====================

interface TemplatesListProps {
  onRefresh: () => void;
}

const TemplatesList: React.FC<TemplatesListProps> = ({ onRefresh }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTemplate, setEditTemplate] = useState<NotificationTemplate | null>(
    null
  );
  const [previewTemplate, setPreviewTemplate] =
    useState<NotificationTemplate | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await dataProvider.getList("notificationTemplates", {
        pagination: { page: 1, perPage: 100 },
        sort: { field: "type", order: "ASC" },
        filter: {},
      });
      setTemplates(response.data as NotificationTemplate[]);
    } catch (error: any) {
      notify(`Error loading templates: ${error.message}`, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveTemplate = async (data: Partial<NotificationTemplate>) => {
    if (!editTemplate) return;
    try {
      await dataProvider.update("notificationTemplates", {
        id: editTemplate.type,
        data,
        previousData: editTemplate,
      });
      notify("Template updated successfully", { type: "success" });
      fetchTemplates();
    } catch (error: any) {
      notify(`Error: ${error.message}`, { type: "error" });
      throw error;
    }
  };

  const handleResetTemplate = async (template: NotificationTemplate) => {
    if (
      !window.confirm(
        `Reset "${template.name}" to default? This will overwrite your customizations.`
      )
    ) {
      return;
    }
    try {
      await dataProvider.create("notificationTemplateReset", {
        data: { type: template.type },
      });
      notify("Template reset to default", { type: "success" });
      fetchTemplates();
    } catch (error: any) {
      notify(`Error: ${error.message}`, { type: "error" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchTemplates}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Grid container spacing={2}>
        {templates.map((template) => (
          <Grid size={{ xs: 12, md: 6 }} key={template.id}>
            <Card
              sx={{
                height: "100%",
                opacity: template.isActive ? 1 : 0.6,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {template.name}
                    </Typography>
                    <Chip
                      label={template.type}
                      size="small"
                      sx={{ mb: 1 }}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Box>
                    <Chip
                      label={template.isActive ? "Active" : "Inactive"}
                      size="small"
                      color={template.isActive ? "success" : "default"}
                    />
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  {template.description}
                </Typography>
                <Typography variant="caption" display="block">
                  <strong>Title:</strong> {template.titleTemplate}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <strong>Body:</strong> {template.bodyTemplate}
                </Typography>
                {template.variables && template.variables.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {template.variables.slice(0, 3).map((v) => (
                      <Chip
                        key={v}
                        label={v}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5, fontSize: "0.7rem" }}
                      />
                    ))}
                    {template.variables.length > 3 && (
                      <Chip
                        label={`+${template.variables.length - 3} more`}
                        size="small"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    )}
                  </Box>
                )}
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Tooltip title="Edit Template">
                    <IconButton
                      size="small"
                      onClick={() => setEditTemplate(template)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Preview">
                    <IconButton
                      size="small"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <PreviewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reset to Default">
                    <IconButton
                      size="small"
                      onClick={() => handleResetTemplate(template)}
                    >
                      <RestoreIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <EditTemplateDialog
        open={!!editTemplate}
        onClose={() => setEditTemplate(null)}
        template={editTemplate}
        onSave={handleSaveTemplate}
      />
      <PreviewDialog
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
      />
    </Box>
  );
};

// ==================== Sent Notifications List ====================

const sentNotificationFilters = [
  <TextInput key="search" label="Search" source="search" alwaysOn />,
  <SelectInput
    key="type"
    source="type"
    label="Type"
    choices={[
      { id: "job_application_received", name: "Application Received" },
      { id: "candidate_hired", name: "Candidate Hired" },
      { id: "candidate_rejected", name: "Candidate Rejected" },
      { id: "interview_reminder", name: "Interview Reminder" },
      { id: "system", name: "System" },
      { id: "platform_maintenance", name: "Platform Maintenance" },
    ]}
    alwaysOn
  />,
  <SelectInput
    key="isRead"
    source="isRead"
    label="Read Status"
    choices={[
      { id: "true", name: "Read" },
      { id: "false", name: "Unread" },
    ]}
  />,
];

const SentNotificationsList = () => {
  return (
    <List
      resource="sentNotifications"
      filters={sentNotificationFilters}
      sort={{ field: "createdAt", order: "DESC" }}
      perPage={25}
      actions={
        <TopToolbar>
          <FilterButton />
          <ExportButton />
        </TopToolbar>
      }
    >
      <Datagrid bulkActionButtons={false}>
        <FunctionField
          label="Recipient"
          render={(record: any) =>
            record.user
              ? `${record.user.firstName} ${record.user.lastName}`
              : record.userId?.substring(0, 8) + "..."
          }
        />
        <FunctionField
          label="Type"
          render={(record: any) => (
            <Chip
              label={record.type?.replace(/_/g, " ")}
              size="small"
              variant="outlined"
            />
          )}
        />
        <TextField source="title" />
        <FunctionField
          label="Body"
          render={(record: any) =>
            record.body?.length > 50
              ? record.body.substring(0, 50) + "..."
              : record.body
          }
        />
        <FunctionField
          label="Status"
          render={(record: any) => (
            <EnhancedChip
              status={record.isRead ? "completed" : "pending"}
              label={record.isRead ? "Read" : "Unread"}
            />
          )}
        />
        <DateField source="createdAt" label="Sent At" showTime />
        <DateField source="readAt" label="Read At" showTime />
      </Datagrid>
    </List>
  );
};

// ==================== Main Notifications Component ====================

const NotificationsMain = () => {
  const [tabValue, setTabValue] = useState(0);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const refresh = useRefresh();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Card>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
            px: 1,
          }}
        >
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Templates" />
            <Tab label="Sent Notifications" />
          </Tabs>
          <Button
            onClick={() => setSendDialogOpen(true)}
            label="Send Notification"
          >
            <SendIcon />
          </Button>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <TemplatesList onRefresh={refresh} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <SentNotificationsList />
        </TabPanel>
      </Card>

      <SendNotificationDialog
        open={sendDialogOpen}
        onClose={() => setSendDialogOpen(false)}
      />
    </Box>
  );
};

// ==================== Export Resource ====================

export const notificationResource = {
  list: NotificationsMain,
  icon: NotificationsIcon,
};
