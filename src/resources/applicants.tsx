import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Show,
  SimpleShowLayout,
  FunctionField,
  ChipField,
  EmailField,
  NumberField,
  TopToolbar,
  ExportButton,
  TextInput,
  SelectInput,
  ShowButton,
} from 'react-admin';
import { Box, Typography, Chip, Avatar } from '@mui/material';
import {
  People as PeopleIcon,
  Star as StarIcon,
  CalendarToday,
} from '@mui/icons-material';
import { EnhancedChip } from '../components/shared/EnhancedChip';
import { formatRelativeTime } from '../utils/dateFormatters';

const applicantFilters = [
  <TextInput key="search" label="Search" source="q" alwaysOn />,
  <SelectInput
    key="status"
    source="status"
    choices={[
      { id: 'pending', name: 'Pending' },
      { id: 'in_queue', name: 'In Queue' },
      { id: 'reviewed', name: 'Reviewed' },
      { id: 'shortlisted', name: 'Shortlisted' },
      { id: 'rejected', name: 'Rejected' },
      { id: 'hired', name: 'Hired' },
    ]}
    alwaysOn
  />,
];

const ListActions = () => (
  <TopToolbar>
    <ExportButton />
  </TopToolbar>
);

export const ApplicantList = () => (
  <List
    filters={applicantFilters}
    actions={<ListActions />}
    sort={{ field: 'appliedAt', order: 'DESC' }}
    storeKey={false}
  >
    <Datagrid rowClick="show">
      <FunctionField
        label="Applicant"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              src={record.applicant?.profileImage}
              alt={`${record.applicant?.firstName} ${record.applicant?.lastName}`}
              sx={{ width: 40, height: 40 }}
            >
              {record.applicant?.firstName?.[0]}
              {record.applicant?.lastName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {record.applicant?.firstName} {record.applicant?.lastName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {record.applicant?.email}
              </Typography>
            </Box>
          </Box>
        )}
      />
      <FunctionField
        label="Job Post"
        render={(record: any) => record.jobPost?.jobTitle || 'N/A'}
      />
      <FunctionField
        label="Status"
        sortable
        sortBy="status"
        render={(record: any) => <EnhancedChip status={record.status} />}
      />
      <FunctionField
        label="Rating"
        render={(record: any) =>
          record.rating ? (
            <Box display="flex" alignItems="center" gap={0.5}>
              <StarIcon sx={{ fontSize: 16, color: '#FFD700' }} />
              <Typography variant="body2">{record.rating}/5</Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Not rated
            </Typography>
          )
        }
      />
      <FunctionField
        label="Applied"
        sortable
        sortBy="appliedAt"
        render={(record: any) => (
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="body2" title={new Date(record.appliedAt).toLocaleString()}>
              {formatRelativeTime(record.appliedAt)}
            </Typography>
          </Box>
        )}
      />
      <ShowButton />
    </Datagrid>
  </List>
);

export const ApplicantShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />

      <FunctionField
        label="Applicant Information"
        render={(record: any) => (
          <Box>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar
                src={record.applicant?.profileImage}
                alt={`${record.applicant?.firstName} ${record.applicant?.lastName}`}
                sx={{ width: 64, height: 64 }}
              >
                {record.applicant?.firstName?.[0]}
                {record.applicant?.lastName?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {record.applicant?.firstName} {record.applicant?.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {record.applicant?.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  User Type: {record.applicant?.userType}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      />

      <FunctionField
        label="Job Post"
        render={(record: any) => (
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {record.jobPost?.jobTitle}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {record.jobPost?.companyName} - {record.jobPost?.location}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Type: {record.jobPost?.jobType} | Workplace: {record.jobPost?.workplaceType}
            </Typography>
          </Box>
        )}
      />

      <ChipField source="status" label="Application Status" />

      <FunctionField
        label="Rating"
        render={(record: any) =>
          record.rating ? (
            <Box display="flex" alignItems="center" gap={0.5}>
              <StarIcon sx={{ fontSize: 20, color: '#FFD700' }} />
              <Typography variant="h6">{record.rating}/5</Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Not rated yet
            </Typography>
          )
        }
      />

      <DateField source="appliedAt" label="Applied At" showTime />

      <FunctionField
        label="Screening Response"
        render={(record: any) =>
          record.screeningResponse ? (
            <Box>
              <Typography variant="body2">
                Video: {record.screeningResponse.videoUrl ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="body2">
                Audio: {record.screeningResponse.audioUrl ? 'Yes' : 'No'}
              </Typography>
              {record.screeningResponse.transcription && (
                <Typography variant="body2" mt={1}>
                  Transcription: {record.screeningResponse.transcription}
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No screening response
            </Typography>
          )
        }
      />

      <FunctionField
        label="Answers"
        render={(record: any) =>
          record.answers && record.answers.length > 0 ? (
            <Box>
              {record.answers.map((answer: any, index: number) => (
                <Box key={index} mb={1}>
                  <Chip
                    label={`Answer ${index + 1}: ${answer.answerType}`}
                    size="small"
                    sx={{ mr: 0.5 }}
                  />
                  {answer.duration && (
                    <Typography variant="caption" color="textSecondary">
                      Duration: {answer.duration}s
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No answers yet
            </Typography>
          )
        }
      />
    </SimpleShowLayout>
  </Show>
);

export const applicantResource = {
  list: ApplicantList,
  show: ApplicantShow,
  icon: PeopleIcon,
};
