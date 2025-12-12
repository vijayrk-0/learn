// app/api/top-apis/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getRespectiveFilePath, readFile, writeFile } from "@/lib/utils";


// Top API type
type TopApi = {
    id: string;
    name: string;
    version: string;
    method: string;
    path: string;
    status: string;
    requests: number;
    errorRatePercent: number;
    p95LatencyMs: number;
    ownerTeam: string;
};

// Dashboard type
type Dashboard = {
    topApis: TopApi[];
};

const dataFilePath = getRespectiveFilePath("dashboard");
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: apiId } = await params;
    const dashboard: Dashboard = await readFile(dataFilePath);
    const api = dashboard.topApis.find((item) => item.id === apiId);

    if (!api) {
        return NextResponse.json({ message: "API not found" }, { status: 404 });
    }

    return NextResponse.json(api);
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: apiId } = await params;
    const patch = (await req.json()) as Partial<TopApi>;

    const dashboard: Dashboard = await readFile(dataFilePath);
    const idx = dashboard.topApis.findIndex((api) => api.id === apiId);

    if (idx === -1) {
        return NextResponse.json({ message: "API not found" }, { status: 404 });
    }

    dashboard.topApis[idx] = { ...dashboard.topApis[idx], ...patch };
    await writeFile(dashboard, dataFilePath);

    return NextResponse.json(dashboard.topApis[idx]);
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: apiId } = await params;

    const dashboard: Dashboard = await readFile(dataFilePath);
    const idx = dashboard.topApis.findIndex((api) => api.id === apiId);

    if (idx === -1) {
        return NextResponse.json({ message: "API not found" }, { status: 404 });
    }

    const deleted = dashboard.topApis[idx];
    dashboard.topApis.splice(idx, 1);
    await writeFile(dashboard, dataFilePath);

    return NextResponse.json(deleted);
}
