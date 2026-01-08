import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiInternal = process.env.API_INTERNAL_URL;

        console.log("🔍 API_INTERNAL_URL =", apiInternal);

        const backendUrl = `${apiInternal}/noodle/top-growth-commodities`;

        console.log("➡️ FETCHING:", backendUrl);

        const res = await fetch(backendUrl, {
            cache: "no-store",
        });

        console.log("⬅️ RESPONSE STATUS:", res.status);

        const text = await res.text();
        console.log("⬅️ RAW RESPONSE:", text);

        if (!res.ok) {
            throw new Error(`Backend error ${res.status}: ${text}`);
        }

        return NextResponse.json(JSON.parse(text));
    } catch (err: any) {
        console.error("❌ ROUTE HANDLER ERROR", err);

        return NextResponse.json(
            { message: err.message },
            { status: 500 }
        );
    }
}