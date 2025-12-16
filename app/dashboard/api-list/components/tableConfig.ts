import { topApiInterface } from "@/app/dashboard/dashboardSchema";

export interface HeadCell {
    id: keyof topApiInterface;
    label: string;
    numeric: boolean;
    sortable: boolean;
    filterable: boolean;
}

export const headCells: readonly HeadCell[] = [
    { id: "name", label: "Name", numeric: false, sortable: true, filterable: true },
    { id: "version", label: "Version", numeric: false, sortable: true, filterable: true },
    { id: "method", label: "Method", numeric: false, sortable: true, filterable: true },
    { id: "path", label: "Path", numeric: false, sortable: true, filterable: true },
    { id: "status", label: "Status", numeric: false, sortable: true, filterable: true },
    { id: "requests", label: "Requests", numeric: true, sortable: true, filterable: true },
    { id: "errorRatePercent", label: "Error %", numeric: true, sortable: true, filterable: true },
    { id: "p95LatencyMs", label: "Latency (P95)", numeric: true, sortable: true, filterable: true },
    { id: "ownerTeam", label: "Owner Team", numeric: false, sortable: true, filterable: true },
];
