// app/api/stablecoins/number-tracked/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const API_BASE_URL = process.env.API_INTERNAL_URL;

        if (!API_BASE_URL) {
            throw new Error("API_INTERNAL_URL is missing");
        }
        const response = await fetch(
            `${API_BASE_URL}/noodle/stablecoins-number-tracked`,
            { cache: 'no-store' }
        );

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (err: any) {
        console.error('Proxy Error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}