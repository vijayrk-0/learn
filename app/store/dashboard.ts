import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface DashboardData {
    meta: {
        environment: string;
        generatedAt: string;
        timeRange: string;
    };
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
        trend: 'up' | 'down';
    }>;
    trafficByHour: Array<{
        hour: string;
        requests: number;
        errors: number;
        avgLatencyMs: number;
    }>;
    topApis: Array<{
        name: string;
        version: string;
        method: string;
        path: string;
        status: 'healthy' | 'degraded' | 'down';
        requests: number;
        errorRatePercent: number;
        p95LatencyMs: number;
        ownerTeam: string;
    }>;
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
        severity: 'high' | 'medium' | 'low';
        title: string;
        message: string;
        metric: string;
        api: string;
        triggeredAt: string;
        status: 'firing' | 'resolved';
    }>;
}

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api",
    }),
    tagTypes: ["Dashboard"],
    endpoints: (builder) => ({
        getDashboardData: builder.query<DashboardData, void>({
            query: () => "/dashboard",
            providesTags: ["Dashboard"],
        }),
    }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
