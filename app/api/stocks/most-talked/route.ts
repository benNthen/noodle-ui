// app/api/stablecoins/most-talked/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const apiInternal = process.env.API_INTERNAL_URL;
        const backendUrl = `${apiInternal}/noodle/most-talked-about-stocks`;
        const res = await fetch(backendUrl, {
            cache: "no-store",
        });

        const text = await res.text();
        console.log("⬅️ RAW RESPONSE:", text);

        if (!res.ok) {
            throw new Error(`Backend error ${res.status}: ${text}`);
        }
        return NextResponse.json(JSON.parse(text));
    } catch (err: any) {
        console.error('Proxy Error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}