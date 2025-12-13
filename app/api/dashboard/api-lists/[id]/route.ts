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
    apiList: Record<string, TopApi>;
};

const dataFilePath = getRespectiveFilePath("dashboard");
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: apiId } = await params;
        const dashboard: Dashboard = await readFile(dataFilePath);
        const apiData = dashboard.apiList[apiId];

        if (!apiData) {
            return NextResponse.json({ message: "API not found" }, { status: 404 });
        }

        // Return data in array format to match frontend expectations
        return NextResponse.json({ data: apiData });
    } catch (error) {
        console.error("Error fetching API data:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

async function updateApiInList(apiId: string, patch: Partial<TopApi>) {
    const dashboard: Dashboard = await readFile(dataFilePath);
    const idx = dashboard.topApis.findIndex((api) => api.id === apiId);

    if (idx === -1) {
        return NextResponse.json({ message: "API not found" }, { status: 404 });
    }

    dashboard.topApis[idx] = { ...dashboard.topApis[idx], ...patch };
    await writeFile(dashboard, dataFilePath);
}


export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: apiId } = await params;
    const patch = (await req.json()) as Partial<TopApi>;

    const dashboard: Dashboard = await readFile(dataFilePath);

    // Fire-and-forget background work with the correct id
    void (async (id: string) => {
        try {
            await updateApiInList(id, patch);
        } catch (err) {
            console.error("Background updateApiInList failed:", err);
        }
    })(apiId);

    dashboard.apiList[apiId] = { ...dashboard.apiList[apiId], ...patch };

    return NextResponse.json(dashboard.apiList[apiId]);
}


async function removeApiFromList(apiId: string) {
    const dashboard: Dashboard = await readFile(dataFilePath);
    const idx = dashboard.topApis.findIndex((api) => api.id === apiId);

    if (idx === -1) {
        return NextResponse.json({ message: "API not found" }, { status: 404 });
    }

    dashboard.topApis.splice(idx, 1);
    await writeFile(dashboard, dataFilePath);
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: apiId } = await params;

    const dashboard: Dashboard = await readFile(dataFilePath);

    // Fire-and-forget background work with the correct id
    void (async (id: string) => {
        try {
            await removeApiFromList(id);
        } catch (err) {
            console.error("Background removeApiFromList failed:", err);
        }
    })(apiId);

    const deleted = dashboard.apiList[apiId];
    delete dashboard.apiList[apiId];
    await writeFile(dashboard, dataFilePath);

    return NextResponse.json(deleted);
}

