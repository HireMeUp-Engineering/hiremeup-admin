import React from "react";
import {
  List,
  Datagrid,
  Show,
  SimpleShowLayout,
  FunctionField,
  useRecordContext,
  TextInput,
  SelectInput,
  NumberInput,
  TopToolbar,
  ExportButton,
  ShowButton,
} from "react-admin";
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Avatar,
  Rating,
  Alert,
} from "@mui/material";
import {
  Feedback as FeedbackIcon,
  Flag as FlagIcon,
  Person as PersonIcon,
  BugReport as BugIcon,
  Lightbulb as IdeaIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import { formatRelativeTime } from "../utils/dateFormatters";

// Filters for the feedback list
const feedbackFilters = [
  <TextInput key="search" label="Search" source="search" alwaysOn />,
  <SelectInput
    key="category"
    source="category"
    choices={[
      { id: "feature_request", name: "Feature Request" },
      { id: "bug_report", name: "Bug Report" },
      { id: "general_feedback", name: "General Feedback" },
    ]}
    alwaysOn
  />,
  <NumberInput
    key="minRating"
    source="minRating"
    label="Min Rating"
    min={1}
    max={5}
    alwaysOn
  />,
  <NumberInput
    key="maxRating"
    source="maxRating"
    label="Max Rating"
    min={1}
    max={5}
    alwaysOn
  />,
  <SelectInput
    key="isFlagged"
    source="isFlagged"
    label="Flagged Only"
    choices={[
      { id: "true", name: "Yes" },
      { id: "false", name: "No" },
    ]}
    alwaysOn
  />,
];

// Get category icon
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "feature_request":
      return <IdeaIcon sx={{ fontSize: 16 }} />;
    case "bug_report":
      return <BugIcon sx={{ fontSize: 16 }} />;
    case "general_feedback":
      return <CommentIcon sx={{ fontSize: 16 }} />;
    default:
      return <FeedbackIcon sx={{ fontSize: 16 }} />;
  }
};

// Get category color
const getCategoryColor = (category: string) => {
  switch (category) {
    case "feature_request":
      return "info";
    case "bug_report":
      return "error";
    case "general_feedback":
      return "default";
    default:
      return "default";
  }
};

// Format category label
const formatCategory = (category: string) => {
  return category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

// Get rating color
const getRatingColor = (rating: number) => {
  if (rating >= 4) return "success";
  if (rating === 3) return "warning";
  return "error";
};

// List Actions
const ListActions = () => (
  <TopToolbar>
    <ExportButton />
  </TopToolbar>
);

// Feedback List
export const FeedbackList = () => (
  <List
    filters={feedbackFilters}
    actions={<ListActions />}
    sort={{ field: "createdAt", order: "DESC" }}
    perPage={25}
    storeKey={false}
  >
    <Datagrid rowClick="show" bulkActionButtons={false} sx={{ tableLayout: "fixed", width: "100%" }}>
      <FunctionField
        label="User"
        sx={{ width: 200, minWidth: 200, maxWidth: 200 }}
        render={(record: any) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", flexShrink: 0 }}>
              <PersonIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box sx={{ overflow: "hidden" }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {record.userName || "Unknown"}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {record.userEmail || "No email"}
              </Typography>
            </Box>
          </Box>
        )}
      />

      <FunctionField
        label="Rating"
        sx={{ width: 160, minWidth: 160, maxWidth: 160 }}
        render={(record: any) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Rating value={record.rating} readOnly size="small" />
            <Chip
              label={record.rating}
              color={getRatingColor(record.rating) as any}
              size="small"
            />
          </Box>
        )}
      />

      <FunctionField
        label="Category"
        sx={{ width: 140, minWidth: 140, maxWidth: 140 }}
        render={(record: any) => (
          <Chip
            icon={getCategoryIcon(record.category)}
            label={formatCategory(record.category)}
            color={getCategoryColor(record.category) as any}
            size="small"
          />
        )}
      />

      <FunctionField
        label="Description"
        sx={{ width: 280, minWidth: 280, maxWidth: 280 }}
        render={(record: any) => (
          <Box>
            <Typography variant="body2" noWrap>
              {record.description}
            </Typography>
            {record.isFlagged && (
              <Chip
                icon={<FlagIcon />}
                label="Flagged"
                color="error"
                size="small"
                sx={{ mt: 0.5 }}
              />
            )}
          </Box>
        )}
      />

      <FunctionField
        label="Status"
        sx={{ width: 100, minWidth: 100, maxWidth: 100 }}
        render={(record: any) =>
          record.reviewedAt ? (
            <Chip
              label="Reviewed"
              color="success"
              size="small"
              variant="outlined"
            />
          ) : (
            <Chip
              label="Pending"
              color="warning"
              size="small"
              variant="outlined"
            />
          )
        }
      />

      <FunctionField
        label="Submitted"
        sx={{ width: 120, minWidth: 120, maxWidth: 120 }}
        render={(record: any) => (
          <Typography variant="body2" color="text.secondary" noWrap>
            {formatRelativeTime(record.createdAt)}
          </Typography>
        )}
      />

      <ShowButton />
    </Datagrid>
  </List>
);

// Feedback Show
export const FeedbackShow = () => {
  const record = useRecordContext();

  // Automatically mark as reviewed when admin views it
  React.useEffect(() => {
    if (record && !record.reviewedAt) {
      // The backend automatically marks it as reviewed, just log it
      console.log("Feedback viewed by admin:", record.id);
    }
  }, [record]);

  return (
    <Show>
      <SimpleShowLayout>
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

        {record?.isFlagged && (
          <Alert severity="error" icon={<FlagIcon />} sx={{ mb: 2 }}>
            <Typography variant="subtitle2">
              This feedback has been flagged as a negative experience by the
              user
            </Typography>
          </Alert>
        )}

        <FunctionField
          label="Rating"
          render={(record: any) => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Rating value={record.rating} readOnly size="large" />
              <Chip
                label={`${record.rating} / 5`}
                color={getRatingColor(record.rating) as any}
                size="medium"
              />
            </Box>
          )}
        />

        <FunctionField
          label="Category"
          render={(record: any) => (
            <Box sx={{ mb: 2 }}>
              <Chip
                icon={getCategoryIcon(record.category)}
                label={formatCategory(record.category)}
                color={getCategoryColor(record.category) as any}
              />
            </Box>
          )}
        />

        <FunctionField
          label="Feedback Description"
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
          label="Review Status"
          render={(record: any) => (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                {record.reviewedAt ? (
                  <Box>
                    <Chip
                      label="Reviewed"
                      color="success"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Reviewed on:{" "}
                      {new Date(record.reviewedAt).toLocaleString()}
                    </Typography>
                    {record.reviewedByAdminName && (
                      <Typography variant="body2" color="text.secondary">
                        Reviewed by: {record.reviewedByAdminName}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Chip
                      label="Pending Review"
                      color="warning"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      This feedback will be marked as reviewed when you view it
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        />

        <FunctionField
          label="Timestamps"
          render={(record: any) => (
            <Box>
              <Typography variant="body2">
                <strong>Submitted:</strong>{" "}
                {new Date(record.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Last Updated:</strong>{" "}
                {new Date(record.updatedAt).toLocaleString()}
              </Typography>
            </Box>
          )}
        />

        <FunctionField
          label="Insights"
          render={(record: any) => (
            <Card
              sx={{
                bgcolor: "info.50",
                borderLeft: "4px solid",
                borderColor: "info.main",
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" color="info.dark" gutterBottom>
                  Feedback Insights
                </Typography>
                <Typography variant="body2">
                  •{" "}
                  {record.rating >= 4
                    ? "Positive feedback"
                    : record.rating === 3
                    ? "Neutral feedback"
                    : "Negative feedback"}
                </Typography>
                <Typography variant="body2">
                  • Category: {formatCategory(record.category)}
                </Typography>
                {record.isFlagged && (
                  <Typography variant="body2" color="error">
                    • User flagged this as a negative experience - needs
                    attention
                  </Typography>
                )}
                {!record.reviewedAt && (
                  <Typography variant="body2" color="warning.dark">
                    • This feedback has not been reviewed yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        />
      </SimpleShowLayout>
    </Show>
  );
};

export const feedbackResource = {
  list: FeedbackList,
  show: FeedbackShow,
  icon: FeedbackIcon,
};
