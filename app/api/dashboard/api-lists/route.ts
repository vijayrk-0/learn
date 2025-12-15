import { NextRequest, NextResponse } from "next/server";
import { getRespectiveFilePath, readFile, writeFile } from "@/lib/utils";

// Top API type
export type TopApi = {
    id: string; // used as key in apiList
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

// Dashboard type with Record
type Dashboard = {
    apiList: Record<string, TopApi>;
};

// Data file path
const dataFile = getRespectiveFilePath("dashboard");

// GET /api/dashboard -> list with filters + pagination
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");

    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit =
        Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 10;

    const filters = {
        name: searchParams.get("name") || undefined,
        version: searchParams.get("version") || undefined,
        method: searchParams.get("method") || undefined,
        path: searchParams.get("path") || undefined,
        status: searchParams.get("status") || undefined,
        requests: searchParams.get("requests") || undefined,
        errorRatePercent: searchParams.get("errorRatePercent") || undefined,
        p95LatencyMs: searchParams.get("p95LatencyMs") || undefined,
        ownerTeam: searchParams.get("ownerTeam") || undefined,
    };

    const dashboard = (await readFile(dataFile)) as Dashboard;

    // work with array for filtering/pagination
    const list = Object.values(dashboard.apiList);
    const filtered = list.filter((item) => {
        const matchString = (field: keyof typeof filters) => {
            const value = filters[field];
            if (!value) return true;
            const itemVal = String((item as any)[field] ?? "");
            return itemVal.toLowerCase().includes(value.toLowerCase());
        };

        const matchNumber = (field: keyof typeof filters) => {
            const value = filters[field];
            if (!value) return true;
            const raw = (item as any)[field];
            const num = typeof raw === "number" ? raw : Number(raw);
            if (!Number.isFinite(num)) return false;

            const opMatch = value.match(/^(>=|<=|>|<|=)(.+)$/);
            if (opMatch) {
                const op = opMatch[1];
                const comp = Number(opMatch[2]);
                if (!Number.isFinite(comp)) return false;
                switch (op) {
                    case ">":
                        return num > comp;
                    case "<":
                        return num < comp;
                    case ">=":
                        return num >= comp;
                    case "<=":
                        return num <= comp;
                    case "=":
                        return num === comp;
                }
            }

            const eq = Number(value);
            if (!Number.isFinite(eq)) return false;
            return num === eq;
        };

        return (
            matchString("name") &&
            matchString("version") &&
            matchString("method") &&
            matchString("path") &&
            matchString("status") &&
            matchString("ownerTeam") &&
            matchNumber("requests") &&
            matchNumber("errorRatePercent") &&
            matchNumber("p95LatencyMs")
        );
    });

    // Sorting
    const sortBy = searchParams.get("sortBy") as keyof TopApi | null;
    const order = searchParams.get("order") === "desc" ? -1 : 1;

    if (sortBy) {
        filtered.sort((a, b) => {
            const valA = (a as any)[sortBy];
            const valB = (b as any)[sortBy];

            if (typeof valA === "number" && typeof valB === "number") {
                return (valA - valB) * order;
            }
            return String(valA).localeCompare(String(valB)) * order;
        });
    }

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

// POST /api/dashboard -> add new API
export async function POST(req: NextRequest) {
    const body = (await req.json()) as TopApi;
    const dashboard = (await readFile(dataFile)) as Dashboard;

    const list = Object.values(dashboard.apiList);

    const exists = list.find(
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
    const id = generateId();
    body.id = id;
    // use body.id as key
    dashboard.apiList[id] = body;
    await writeFile(dashboard, dataFile);

    return NextResponse.json(body, { status: 201 });
}

// Custom id generation function
function generateId(): string {
    return crypto.randomUUID();
}





