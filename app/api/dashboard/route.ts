import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';


export async function GET(request: Request) {
    try {
        // Read the dashboard JSON file
        const filePath = path.join(process.cwd(), 'app', 'data', 'dashboard.json');

        const fileContents = await fs.readFile(filePath, 'utf8');

        const dashboardData = JSON.parse(fileContents);

        // Return the dashboard data with cache control headers
        return NextResponse.json(dashboardData, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error: any) {
        console.error('Dashboard API error:', error);

        // Handle file not found
        if (error.code === 'ENOENT') {
            return NextResponse.json(
                { message: 'Dashboard data file not found' },
                { status: 404 }
            );
        }

        // Not JSON format error handler
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { message: 'Invalid JSON format in dashboard data file' },
                { status: 500 }
            );
        }

        //  Internal server error handler
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
