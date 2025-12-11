// Top API interface
export interface topApiInterface {
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

export interface APILIst{
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
