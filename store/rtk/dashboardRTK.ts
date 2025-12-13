import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

import { topApiInterface, metaInterface } from "@/app/dashboard/dashboardSchema";


// Dashboard interface
export interface DashboardData {
  meta: metaInterface;
  summary: {
    totalApis: number;
    totalRequests: number;
    avgLatencyMs: number;
    errorRatePercent: number;
    activeConsumers: number;
  };
  kpis: Array<{
    id: string;
    label: string;
    value: number;
    unit?: string;
    changePercent: number;
    trend: "up" | "down";
  }>;
  trafficByHour: Array<{
    hour: string;
    requests: number;
    errors: number;
    avgLatencyMs: number;
  }>;
  topApis: Array<topApiInterface>;
  statusCodes: Array<{
    code: number;
    count: number;
  }>;
  topConsumers: Array<{
    name: string;
    type: string;
    requests: number;
    errorRatePercent: number;
    lastSeen: string;
  }>;
  alerts: Array<{
    id: string;
    severity: "high" | "medium" | "low";
    title: string;
    message: string;
    metric: string;
    api: string;
    triggeredAt: string;
    status: "firing" | "resolved";
  }>;
}

type TopApisResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: topApiInterface[];
};

export type TopApisQueryArgs = {
  page?: number;
  limit?: number;
  name?: string;
  version?: string;
  method?: string;
  path?: string;
  status?: string;
  requests?: string;
  errorRatePercent?: string;
  p95LatencyMs?: string;
  ownerTeam?: string;
};

// shared prepareHeaders for bearer token
const authBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Dashboard API
export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: authBaseQuery,
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardData, void>({
      query: () => ({
        url: "/dashboard",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

// Dashboard API List
export const dashboardApiList = createApi({
  reducerPath: "dashboardApiList",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/dashboard/api-lists",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["DashboardList"],
  endpoints: (builder) => ({
    getDashboardDataListById: builder.query<topApiInterface, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (result) => [
        "DashboardList",
        { type: "DashboardList", id: result?.id },
      ],
    }),
    getDashboardDataList: builder.query<TopApisResponse, TopApisQueryArgs | void>({
      query: (args) => {
        const params = new URLSearchParams();

        const {
          page = 1,
          limit = 10,
          name,
          version,
          method,
          path,
          status,
          requests,
          errorRatePercent,
          p95LatencyMs,
          ownerTeam,
        } = args || {};

        params.set("page", String(page));
        params.set("limit", String(limit));

        if (name) params.set("name", name);
        if (version) params.set("version", version);
        if (method) params.set("method", method);
        if (path) params.set("path", path);
        if (status) params.set("status", status);
        if (requests) params.set("requests", requests);
        if (errorRatePercent) params.set("errorRatePercent", errorRatePercent);
        if (p95LatencyMs) params.set("p95LatencyMs", p95LatencyMs);
        if (ownerTeam) params.set("ownerTeam", ownerTeam);

        return {
          url: `?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["DashboardList"],
    }),

    addDashboardDataList: builder.mutation<topApiInterface, topApiInterface>({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DashboardList"],
    }),

    updateDashboardDataList: builder.mutation<
      topApiInterface,
      { id: string; patch: Partial<topApiInterface> }
    >({
      query: ({ id, patch }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["DashboardList"],
    }),

    deleteDashboardDataList: builder.mutation<
      { ok: boolean },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DashboardList"],
    }),
  }),
});

export const {
  useGetDashboardDataListQuery,
  useAddDashboardDataListMutation,
  useUpdateDashboardDataListMutation,
  useDeleteDashboardDataListMutation,
  useGetDashboardDataListByIdQuery,
} = dashboardApiList;
export const { useGetDashboardDataQuery } = dashboardApi;
