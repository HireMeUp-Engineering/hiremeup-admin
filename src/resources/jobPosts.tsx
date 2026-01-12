import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  Show,
  SimpleShowLayout,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  FunctionField,
  ShowButton,
  FilterButton,
  TopToolbar,
  ExportButton,
} from "react-admin";
import { Chip, Box, Card, Avatar, Typography } from "@mui/material";
import {
  Work as WorkIcon,
  CalendarToday,
  LocationOn,
} from "@mui/icons-material";
import { EnhancedChip } from "../components/shared/EnhancedChip";
import { formatRelativeTime } from "../utils/dateFormatters";

const jobPostFilters = [
  <TextInput key="search" label="Search" source="search" alwaysOn />,
  <SelectInput
    key="status"
    source="status"
    choices={[
      { id: "draft", name: "Draft" },
      { id: "published", name: "Published" },
      { id: "closed", name: "Closed" },
      { id: "archived", name: "Archived" },
    ]}
  />,
];

const formatEmploymentType = (type: string) => {
  const typeMap: { [key: string]: string } = {
    full_time: "Full Time",
    part_time: "Part Time",
    gig: "Gig",
    seasonal: "Seasonal",
    contract: "Contract",
    internship: "Internship",
  };
  return typeMap[type] || type;
};

// Custom exporter to handle export with proper field formatting
const jobPostExporter = (records: any[]) => {
  const headers = [
    "Job Title",
    "Posted By",
    "Email",
    "City",
    "Company",
    "Status",
    "Type",
    "Applications",
    "Created",
  ];

  const rows = records.map((record) => [
    record.jobTitle || "",
    record.posterName || "",
    record.posterEmail || "",
    record.city || "",
    record.companyName || "",
    record.status || "",
    formatEmploymentType(record.employmentType || ""),
    record.applicationCount || 0,
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
    `job-posts-${new Date().toISOString().split("T")[0]}.csv`
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

export const JobPostList = () => (
  <List
    filters={jobPostFilters}
    actions={<ListActions />}
    sort={{ field: "createdAt", order: "DESC" }}
    exporter={jobPostExporter}
    perPage={20}
  >
    <Datagrid rowClick="show">
      <TextField source="jobTitle" label="Job Title" sortable />
      <FunctionField
        label="Posted By"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 40, height: 40 }}>
              {record.posterName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {record.posterName || "N/A"}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {record.posterEmail || ""}
              </Typography>
            </Box>
          </Box>
        )}
      />
      <FunctionField
        label="City"
        sortable
        sortBy="city"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2">{record.city || "N/A"}</Typography>
          </Box>
        )}
      />
      <TextField source="companyName" label="Company" sortable />
      <FunctionField
        label="Status"
        sortable
        sortBy="status"
        render={(record: any) => <EnhancedChip status={record.status} />}
      />
      <FunctionField
        label="Type"
        sortable
        sortBy="employmentType"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            <WorkIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2">
              {formatEmploymentType(record.employmentType)}
            </Typography>
          </Box>
        )}
      />
      <NumberField source="applicationCount" label="Applications" sortable />
      <FunctionField
        label="Created"
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

export const JobPostShow = () => (
  <Show>
    <SimpleShowLayout>
      <FunctionField
        label=""
        render={(record: any) => (
          <Box sx={{ mb: 2 }}>
            <Card sx={{ mb: 2 }}>
              <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
                <h2 style={{ margin: 0 }}>{record.jobTitle}</h2>
                <Chip
                  label={record.status}
                  size="small"
                  sx={{ mt: 1, bgcolor: "white", color: "primary.main" }}
                />
              </Box>
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <Box>
                    <strong>Company:</strong> {record.companyName || "N/A"}
                  </Box>
                  <Box>
                    <strong>Location:</strong>{" "}
                    {record.city
                      ? `${record.address || ""} ${record.city}, ${
                          record.zip || ""
                        }`.trim()
                      : "N/A"}
                  </Box>
                  <Box>
                    <strong>Employment Type:</strong>{" "}
                    {record.employmentType || "N/A"}
                  </Box>
                  <Box>
                    <strong>Views:</strong> {record.viewCount || 0}
                  </Box>
                  <Box>
                    <strong>Applications:</strong>{" "}
                    {record.applicationCount || 0}
                  </Box>
                  <Box>
                    <strong>Published:</strong>{" "}
                    {record.publishedAt
                      ? new Date(record.publishedAt).toLocaleString()
                      : "Not published"}
                  </Box>
                </Box>
              </Box>
            </Card>

            <Card sx={{ mb: 2 }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <h3 style={{ margin: 0 }}>Posted By</h3>
              </Box>
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <Box>
                    <strong>Name:</strong> {record.poster?.firstName}{" "}
                    {record.poster?.lastName}
                  </Box>
                  <Box>
                    <strong>Email:</strong> {record.poster?.email}
                  </Box>
                  {/* <Box>
                    <strong>User ID:</strong> {record.userId}
                  </Box> */}
                  <Box>
                    <strong>Active:</strong>{" "}
                    {record.poster?.isActive ? "Yes" : "No"}
                  </Box>
                </Box>
              </Box>
            </Card>

            <Card sx={{ mb: 2 }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <h3 style={{ margin: 0 }}>Compensation</h3>
              </Box>
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <Box>
                    <strong>Pay Type:</strong>{" "}
                    {record.isSalary
                      ? "Salary"
                      : record.isHourly
                      ? "Hourly"
                      : "N/A"}
                  </Box>
                  <Box>
                    <strong>Pay Range:</strong>{" "}
                    {record.payRangeMin && record.payRangeMax
                      ? `${record.payCurrency || "$"}${record.payRangeMin} - ${
                          record.payCurrency || "$"
                        }${record.payRangeMax}`
                      : "Not specified"}
                  </Box>
                  <Box>
                    <strong>Hours Per Week:</strong>{" "}
                    {record.minHoursPerWeek && record.maxHoursPerWeek
                      ? `${record.minHoursPerWeek} - ${record.maxHoursPerWeek} hrs`
                      : "Not specified"}
                  </Box>
                  {/* <Box>
                    <strong>Duration:</strong> {
                      record.startDate && record.endDate
                        ? `${new Date(record.startDate).toLocaleDateString()} - ${new Date(record.endDate).toLocaleDateString()}`
                        : 'Not specified'
                    }
                  </Box> */}
                </Box>
              </Box>
            </Card>

            <Card sx={{ mb: 2 }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <h3 style={{ margin: 0 }}>Job Description</h3>
              </Box>
              <Box sx={{ p: 2 }}>
                {record.jobDescription ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: record.jobDescription }}
                  />
                ) : (
                  <p style={{ color: "#666" }}>No job description provided</p>
                )}
              </Box>
            </Card>

            {record.projectDescription && (
              <Card sx={{ mb: 2 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <h3 style={{ margin: 0 }}>Project Description</h3>
                </Box>
                <Box sx={{ p: 2 }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: record.projectDescription,
                    }}
                  />
                </Box>
              </Card>
            )}

            {(record.mainVideoUrl || record.mainAudioUrl) && (
              <Card sx={{ mb: 2 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <h3 style={{ margin: 0 }}>Main Screening Media</h3>
                </Box>
                <Box sx={{ p: 2 }}>
                  {record.mainVideoUrl && (
                    <Box sx={{ mb: 2 }}>
                      <video
                        src={record.mainVideoUrl}
                        controls
                        style={{
                          width: "100%",
                          maxWidth: 800,
                          borderRadius: 8,
                        }}
                        poster={record.mainThumbnailUrl}
                      />
                    </Box>
                  )}
                  {record.mainAudioUrl && !record.mainVideoUrl && (
                    <Box sx={{ mb: 2 }}>
                      <audio
                        src={record.mainAudioUrl}
                        controls
                        style={{ width: "100%" }}
                      />
                    </Box>
                  )}
                  {record.mainTranscription && (
                    <Box
                      sx={{ mt: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: 1 }}
                    >
                      <strong>Transcription:</strong>
                      <p style={{ marginTop: 8 }}>{record.mainTranscription}</p>
                    </Box>
                  )}
                </Box>
              </Card>
            )}

            {record.applications && record.applications.length > 0 && (
              <Card>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <h3 style={{ margin: 0 }}>
                    Applications ({record.applications.length})
                  </h3>
                </Box>
                <Box sx={{ p: 2 }}>
                  {record.applications.map((app: any) => (
                    <Box
                      key={app.id}
                      sx={{
                        p: 2,
                        mb: 1,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        "&:last-child": { mb: 0 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <strong>{app.applicantName}</strong>
                          <br />
                          <span style={{ fontSize: "0.875rem", color: "#666" }}>
                            {app.applicantEmail}
                          </span>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Chip
                            label={app.status}
                            size="small"
                            sx={{ mb: 0.5 }}
                          />
                          <br />
                          <span style={{ fontSize: "0.75rem", color: "#666" }}>
                            Applied:{" "}
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>
            )}
          </Box>
        )}
      />
    </SimpleShowLayout>
  </Show>
);

export const JobPostEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="jobTitle" label="Job Title" fullWidth required />
      <TextInput source="companyName" label="Company Name" fullWidth />
      <TextInput source="location" fullWidth />
      <SelectInput
        source="status"
        choices={[
          { id: "draft", name: "Draft" },
          { id: "published", name: "Published" },
        ]}
      />
      <SelectInput
        source="jobType"
        choices={[
          { id: "full_time", name: "Full Time" },
          { id: "part_time", name: "Part Time" },
          { id: "contract", name: "Contract" },
          { id: "internship", name: "Internship" },
        ]}
      />
      <SelectInput
        source="workplaceType"
        choices={[
          { id: "on_site", name: "On Site" },
          { id: "remote", name: "Remote" },
          { id: "hybrid", name: "Hybrid" },
        ]}
      />
      <TextInput source="description" multiline rows={5} fullWidth />
      <SelectInput
        source="experienceLevel"
        choices={[
          { id: "entry", name: "Entry Level" },
          { id: "mid", name: "Mid Level" },
          { id: "senior", name: "Senior" },
          { id: "lead", name: "Lead" },
        ]}
      />
      <NumberInput source="minSalary" label="Min Salary" />
      <NumberInput source="maxSalary" label="Max Salary" />
      <NumberInput source="hoursPerWeek" label="Hours Per Week" />
    </SimpleForm>
  </Edit>
);

export const jobPostResource = {
  list: JobPostList,
  show: JobPostShow,
  icon: WorkIcon,
};
