// Top API interface
export interface topApiInterface {
    id: any;
    name: string;
    version: string;
    method: string;
    path: string;
    status: "healthy" | "degraded" | "down";
    requests: number;
    errorRatePercent: number;
    p95LatencyMs: number;
    ownerTeam: string;
}

// API List interface
export interface APIListResponseInterface{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: topApiInterface[];
}

// Meta interface
export interface metaInterface {
    environment: string;
    generatedAt: string;
    timeRange: string;
}

// Alert interface
export interface AlertItemInterface {
    id: string | number;
    severity: string;
    status: string;
    title: string;
    message: string;
    api: string;
}

export interface summaryInterface {
    totalRequests: number;
    avgLatencyMs: number;
    errorRatePercent: number;
    activeConsumers: number;
}