import { DataProvider, fetchUtils } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  throw new Error("REACT_APP_API_URL environment variable is required");
}

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }

  const auth = localStorage.getItem("auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    (options.headers as Headers).set("Authorization", `Bearer ${token}`);
  }

  return fetchUtils.fetchJson(url, options);
};

const baseDataProvider = simpleRestProvider(API_URL, httpClient);

export const dataProvider: DataProvider = {
  ...baseDataProvider,

  // Custom implementations for specific resources
  getList: async (resource, params) => {
    if (resource === "jobPosts") {
      const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
      const { field, order } = params.sort || {
        field: "createdAt",
        order: "DESC",
      };
      const query = {
        page: page.toString(),
        limit: perPage.toString(),
        sortBy: field,
        sortOrder: order,
        ...params.filter,
      };

      const url = `${API_URL}/admin/job-posts?${new URLSearchParams(
        query as any
      )}`;
      const { json } = await httpClient(url);

      return {
        data: json.jobPosts.map((item: any) => ({ ...item, id: item.id })),
        total: json.total,
      };
    }

    if (resource === "queue") {
      const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
      const query = {
        page: page.toString(),
        limit: perPage.toString(),
        ...params.filter,
      };

      const url = `${API_URL}/queue?${new URLSearchParams(query)}`;
      const { json } = await httpClient(url);

      return {
        data: json.queue.map((item: any) => ({ ...item, id: item.id })),
        total: json.total,
      };
    }

    if (resource === "applicants") {
      const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
      const query = {
        page: page.toString(),
        limit: perPage.toString(),
        ...params.filter,
      };

      const url = `${API_URL}/jobPost/applicants/all?${new URLSearchParams(
        query
      )}`;
      const { json } = await httpClient(url);

      return {
        data: json.applicants.map((item: any) => ({ ...item, id: item.id })),
        total: json.total,
      };
    }

    if (resource === "users") {
      const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
      const { field, order } = params.sort || {
        field: "createdAt",
        order: "DESC",
      };
      const query = {
        page: page.toString(),
        limit: perPage.toString(),
        sortBy: field,
        sortOrder: order,
        ...params.filter,
      };

      const url = `${API_URL}/admin/users?${new URLSearchParams(query as any)}`;
      const { json } = await httpClient(url);

      return {
        data: json.users.map((item: any) => ({ ...item, id: item.id })),
        total: json.total,
      };
    }

    if (resource === "adminApplications") {
      const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
      const { field, order } = params.sort || {
        field: "appliedAt",
        order: "DESC",
      };
      // Map frontend filter names to backend expected names
      const { minRating, ...restFilter } = params.filter || {};
      const query: Record<string, string> = {
        page: page.toString(),
        limit: perPage.toString(),
        sortBy: field,
        sortOrder: order,
        ...restFilter,
      };
      // Map minRating to ratingMin for backend compatibility
      if (minRating !== undefined) {
        query.ratingMin = minRating;
      }

      const url = `${API_URL}/admin/applications?${new URLSearchParams(query)}`;
      const { json } = await httpClient(url);

      return {
        data: json.applications.map((item: any) => ({ ...item, id: item.id })),
        total: json.total,
      };
    }

    if (resource === "rejectionFeedback") {
      const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
      const query = {
        page: page.toString(),
        limit: perPage.toString(),
        ...params.filter,
      };

      const url = `${API_URL}/admin/applications/rejection-feedback/list?${new URLSearchParams(
        query
      )}`;
      const { json } = await httpClient(url);

      return {
        data: json.feedback.map((item: any) => ({ ...item, id: item.id })),
        total: json.total,
      };
    }

    if (resource === "interviewAudit") {
      const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
      const { field, order } = params.sort || {
        field: "scheduledAt",
        order: "DESC",
      };
      const query = {
        page: page.toString(),
        limit: perPage.toString(),
        sortBy: field,
        sortOrder: order,
        ...params.filter,
      };

      const url = `${API_URL}/admin/interviews/audit?${new URLSearchParams(
        query as any
      )}`;
      const { json } = await httpClient(url);

      return {
        data: json.interviews.map((item: any) => ({ ...item, id: item.id })),
        total: json.total,
      };
    }

    if (resource === "supportTickets") {
      const { page, perPage } = params.pagination || { page: 1, perPage: 25 };
      const { field, order } = params.sort || {
        field: "createdAt",
        order: "DESC",
      };
      const query = {
        page: page.toString(),
        limit: perPage.toString(),
        sortBy: field,
        sortOrder: order,
        ...params.filter,
      };

      const url = `${API_URL}/admin/support/tickets?${new URLSearchParams(
        query as any
      )}`;
      const { json } = await httpClient(url);

      return {
        data: json.tickets.map((item: any) => ({ ...item, id: item.id })),
        total: json.total,
      };
    }

    if (resource === "feedback") {
      const { page, perPage } = params.pagination || { page: 1, perPage: 25 };
      const { field, order } = params.sort || {
        field: "createdAt",
        order: "DESC",
      };
      const query = {
        page: page.toString(),
        limit: perPage.toString(),
        sortBy: field,
        sortOrder: order,
        ...params.filter,
      };

      const url = `${API_URL}/admin/support/feedback?${new URLSearchParams(
        query as any
      )}`;
      const { json } = await httpClient(url);

      return {
        data: json.feedback.map((item: any) => ({ ...item, id: item.id })),
        total: json.total,
      };
    }

    // Notification Templates
    if (resource === "notificationTemplates") {
      const url = `${API_URL}/notifications/admin/templates`;
      const { json } = await httpClient(url);

      return {
        data: json.templates.map((item: any) => ({ ...item, id: item.id })),
        total: json.total,
      };
    }

    // Sent Notifications
    if (resource === "sentNotifications") {
      const { page, perPage } = params.pagination || { page: 1, perPage: 25 };
      const { field, order } = params.sort || {
        field: "createdAt",
        order: "DESC",
      };
      // Map pagination params to backend format
      const query: Record<string, string> = {
        currentPage: page.toString(),
        pageLength: perPage.toString(),
      };
      // Add filters
      if (params.filter) {
        if (params.filter.type) query.type = params.filter.type;
        if (params.filter.isRead) query.isRead = params.filter.isRead;
        if (params.filter.search) query.search = params.filter.search;
      }

      const url = `${API_URL}/notifications/admin/notifications?${new URLSearchParams(
        query
      )}`;
      const { json } = await httpClient(url);

      return {
        data: json.notifications.map((item: any) => ({ ...item, id: item.id })),
        total: json.total,
      };
    }

    return baseDataProvider.getList(resource, params);
  },

  getOne: async (resource, params) => {
    if (resource === "jobPosts") {
      const url = `${API_URL}/admin/job-posts/${params.id}`;
      const { json } = await httpClient(url);
      return { data: { ...json.jobPost, id: json.jobPost.id } };
    }

    if (resource === "users") {
      const url = `${API_URL}/admin/users/${params.id}`;
      const { json } = await httpClient(url);
      return { data: { ...json.user, id: json.user.id } };
    }

    if (resource === "adminApplications") {
      const url = `${API_URL}/admin/applications/${params.id}`;
      const { json } = await httpClient(url);
      return { data: { ...json.application, id: json.application.id } };
    }

    if (resource === "rejectionFeedback") {
      const url = `${API_URL}/admin/applications/rejection-feedback/${params.id}`;
      const { json } = await httpClient(url);
      return { data: { ...json, id: json.id } };
    }

    if (resource === "interviewAudit") {
      const url = `${API_URL}/admin/interviews/audit/${params.id}`;
      const { json } = await httpClient(url);
      return { data: { ...json, id: json.id } };
    }

    if (resource === "supportTickets") {
      const url = `${API_URL}/admin/support/tickets/${params.id}`;
      const { json } = await httpClient(url);
      return { data: { ...json.ticket, id: json.ticket.id } };
    }

    if (resource === "feedback") {
      const url = `${API_URL}/admin/support/feedback/${params.id}`;
      const { json } = await httpClient(url);
      return { data: { ...json.feedback, id: json.feedback.id } };
    }

    // Notification Template by type
    if (resource === "notificationTemplates") {
      const url = `${API_URL}/notifications/admin/templates/${params.id}`;
      const { json } = await httpClient(url);
      return { data: { ...json, id: json.id || params.id } };
    }

    return baseDataProvider.getOne(resource, params);
  },

  create: async (resource, params) => {
    if (resource === "queue") {
      const url = `${API_URL}/queue/add`;
      const { json } = await httpClient(url, {
        method: "POST",
        body: JSON.stringify(params.data),
      });
      return { data: { ...json.queueItem, id: json.queueItem.id } };
    }

    // Send bulk notification
    if (resource === "notificationSend") {
      const url = `${API_URL}/notifications/admin/send`;
      const { json } = await httpClient(url, {
        method: "POST",
        body: JSON.stringify(params.data),
      });
      return { data: { ...json, id: "send" } };
    }

    // Preview notification template
    if (resource === "notificationTemplatePreview") {
      const url = `${API_URL}/notifications/admin/templates/preview`;
      const { json } = await httpClient(url, {
        method: "POST",
        body: JSON.stringify(params.data),
      });
      return { data: { ...json, id: "preview" } };
    }

    // Reset notification template to default
    if (resource === "notificationTemplateReset") {
      const url = `${API_URL}/notifications/admin/templates/reset/${params.data.type}`;
      const { json } = await httpClient(url, {
        method: "POST",
      });
      return { data: { ...json, id: json.id || params.data.type } };
    }

    return baseDataProvider.create(resource, params);
  },

  update: async (resource, params) => {
    if (resource === "queue") {
      const url = `${API_URL}/queue/poster/${params.id}`;
      const { json } = await httpClient(url, {
        method: "PUT",
        body: JSON.stringify(params.data),
      });
      return { data: { ...json.queueItem, id: json.queueItem.id } };
    }

    if (resource === "jobPosts") {
      const url = `${API_URL}/jobPost/${params.id}`;
      const { json } = await httpClient(url, {
        method: "PUT",
        body: JSON.stringify(params.data),
      });
      return { data: { ...json.jobPost, id: json.jobPost.id } };
    }

    if (resource === "users") {
      // Handle block/unblock
      if (params.data.action === "block") {
        const url = `${API_URL}/admin/users/${params.id}/block`;
        const { json } = await httpClient(url, {
          method: "PATCH",
          body: JSON.stringify({ reason: params.data.reason }),
        });
        return { data: { ...json.user, id: json.user.id } };
      } else if (params.data.action === "unblock") {
        const url = `${API_URL}/admin/users/${params.id}/unblock`;
        const { json } = await httpClient(url, {
          method: "PATCH",
        });
        return { data: { ...json.user, id: json.user.id } };
      } else if (params.data.action === "delete") {
        const url = `${API_URL}/admin/users/${params.id}`;
        const { json } = await httpClient(url, {
          method: "DELETE",
          body: JSON.stringify({ ticketId: params.data.ticketId }),
        });
        return { data: { id: params.id, ...json } };
      } else if (params.data.action === "checkDeleteEligibility") {
        const url = `${API_URL}/admin/users/${params.id}/delete-eligibility`;
        const { json } = await httpClient(url);
        return { data: { id: params.id, ...json } };
      }
    }

    if (resource === "adminApplications") {
      // Handle notes, rating, or status update
      if (params.data.notes !== undefined) {
        const url = `${API_URL}/admin/applications/${params.id}/notes`;
        const { json } = await httpClient(url, {
          method: "PATCH",
          body: JSON.stringify({ notes: params.data.notes }),
        });
        return { data: { ...json, id: json.id } };
      } else if (params.data.rating !== undefined) {
        const url = `${API_URL}/admin/applications/${params.id}/rating`;
        const { json } = await httpClient(url, {
          method: "PATCH",
          body: JSON.stringify({ rating: params.data.rating }),
        });
        return { data: { ...json, id: json.id } };
      } else if (params.data.status !== undefined) {
        const url = `${API_URL}/admin/applications/${params.id}/status`;
        const { json } = await httpClient(url, {
          method: "PATCH",
          body: JSON.stringify({ status: params.data.status }),
        });
        return { data: { ...json, id: json.id } };
      }
    }

    if (resource === "supportTickets") {
      // Handle status or priority update
      if (params.data.action === "updateStatus") {
        const url = `${API_URL}/admin/support/tickets/${params.id}/status`;
        const { json } = await httpClient(url, {
          method: "PATCH",
          body: JSON.stringify({
            status: params.data.status,
            resolutionMessage: params.data.resolutionMessage,
          }),
        });
        return { data: { ...json.ticket, id: json.ticket.id } };
      } else if (params.data.action === "updatePriority") {
        const url = `${API_URL}/admin/support/tickets/${params.id}/priority`;
        const { json } = await httpClient(url, {
          method: "PATCH",
          body: JSON.stringify({ priority: params.data.priority }),
        });
        return { data: { ...json.ticket, id: json.ticket.id } };
      }
    }

    // Update notification template
    if (resource === "notificationTemplates") {
      const url = `${API_URL}/notifications/admin/templates/${params.id}`;
      const { json } = await httpClient(url, {
        method: "PUT",
        body: JSON.stringify(params.data),
      });
      return { data: { ...json, id: json.id || params.id } };
    }

    return baseDataProvider.update(resource, params);
  },

  delete: async (resource, params) => {
    if (resource === "queue") {
      const url = `${API_URL}/queue/poster/${params.id}`;
      await httpClient(url, { method: "DELETE" });
      return { data: { id: params.id } as any };
    }

    if (resource === "jobPosts") {
      const url = `${API_URL}/jobPost/${params.id}`;
      await httpClient(url, { method: "DELETE" });
      return { data: { id: params.id } as any };
    }

    return baseDataProvider.delete(resource, params);
  },
};
