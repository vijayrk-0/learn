import { NextRequest, NextResponse } from "next/server";
import { getRespectiveFilePath, readFile, writeFile } from "@/lib/utils";

// Top API type
type TopApi = {
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

// Data file path
const dataFile = getRespectiveFilePath("dashboard");

export async function GET(request: Request) {
    // Get query params
    const { searchParams } = new URL(request.url);

    //   Get page and limit set default to 1 and 10
    const page = Number(searchParams.get('page') ?? '1');
    const limit = Number(searchParams.get('limit') ?? '10');

    //   Validate page and limit
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;

    //   Validate limit
    const safeLimit =
        Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 10;

    //   Get filters
    const filters = {
        name: searchParams.get('name') || undefined,
        version: searchParams.get('version') || undefined,
        method: searchParams.get('method') || undefined,
        path: searchParams.get('path') || undefined,
        status: searchParams.get('status') || undefined,
        requests: searchParams.get('requests') || undefined,
        errorRatePercent: searchParams.get('errorRatePercent') || undefined,
        p95LatencyMs: searchParams.get('p95LatencyMs') || undefined,
        ownerTeam: searchParams.get('ownerTeam') || undefined,
    };

    //   Read from file
    const dashboard = await readFile(dataFile);

    //   Filter
    const filtered = dashboard.topApis.filter((item: any) => {
        // string contains (case-insensitive)
        const matchString = (field: keyof typeof filters) => {
            const value = filters[field];
            if (!value) return true;
            const itemVal = String(item[field] ?? '');
                return itemVal.toLowerCase().includes(value.toLowerCase());
        };

        // numeric equals or range (e.g. ">=100", "<50")
        const matchNumber = (field: keyof typeof filters) => {
            const value = filters[field];
            if (!value) return true;
            const raw = item[field];
            const num = typeof raw === 'number' ? raw : Number(raw);
            if (!Number.isFinite(num)) return false;

            // very simple operator parsing: >=, <=, >, <, =
            const opMatch = value.match(/^(>=|<=|>|<|=)(.+)$/);
            if (opMatch) {
                const op = opMatch[1];
                const comp = Number(opMatch[2]);
                if (!Number.isFinite(comp)) return false;
                switch (op) {
                    case '>': return num > comp;
                    case '<': return num < comp;
                    case '>=': return num >= comp;
                    case '<=': return num <= comp;
                    case '=': return num === comp;
                }
            }

            // fallback: plain equality
            const eq = Number(value);
            if (!Number.isFinite(eq)) return false;
            return num === eq;
        };

        return (
            matchString('name') &&
            matchString('version') &&
            matchString('method') &&
            matchString('path') &&
            matchString('status') &&
            matchString('ownerTeam') &&
            matchNumber('requests') &&
            matchNumber('errorRatePercent') &&
            matchNumber('p95LatencyMs')
        );
    });

    //   Get total and paged items
    const total = filtered.length;
    const offset = (safePage - 1) * safeLimit;
    const pagedItems = filtered.slice(offset, offset + safeLimit);

    return NextResponse.json({
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: pagedItems,
    });
}


// POST /api/top-apis -> add new API
export async function POST(req: NextRequest) {
    const body = (await req.json()) as TopApi;
    const dashboard: Dashboard = await readFile(dataFile);

    const exists = dashboard.topApis.find(
        (api) =>
            api.name === body.name &&
            api.method === body.method &&
            api.path === body.path
    );
    if (exists) {
        return NextResponse.json(
            { message: "API already exists" },
            { status: 409 }
        );
    }

    dashboard.topApis.push(body);
    await writeFile(dashboard, dataFile);
    return NextResponse.json(body, { status: 201 });
}

// PATCH -> update one API (by name+method+path)
export async function PATCH(req: NextRequest) {
    const { key, patch } = (await req.json()) as {
        key: { name: string; method: string; path: string };
        patch: Partial<TopApi>;
    };

    // Read from file
    const dashboard: Dashboard = await readFile(dataFile);
    // Find index of API to update
    const idx = dashboard.topApis.findIndex(
        (api) =>
            api.name === key.name &&
            api.method === key.method &&
            api.path === key.path
    );

    // If not found, return 404
    if (idx === -1) {
        return NextResponse.json(
            { message: "API not found" },
            { status: 404 }
        );
    }

    // Update in file
    dashboard.topApis[idx] = { ...dashboard.topApis[idx], ...patch };
    // Write back to file
    await writeFile(dashboard, dataFile);
    // Return updated API
    return NextResponse.json(dashboard.topApis[idx]);
}

// DELETE -> delete one API (by name+method+path)
export async function DELETE(req: NextRequest) {
    const { name, method, path: apiPath } = (await req.json()) as {
        name: string;
        method: string;
        path: string;
    };

    // Read from file
    const dashboard: Dashboard = await readFile(dataFile);
    const before = dashboard.topApis.length;

    // Delete from file
    dashboard.topApis = dashboard.topApis.filter(
        (api) =>
            !(
                api.name === name &&
                api.method === method &&
                api.path === apiPath
            )
    );

    // If no change, return 404
    if (dashboard.topApis.length === before) {
        return NextResponse.json(
            { message: "API not found" },
            { status: 404 }
        );
    }

    // Write back to file
    await writeFile(dashboard, dataFile);
    // Return success response
    return NextResponse.json({ ok: true });
}
