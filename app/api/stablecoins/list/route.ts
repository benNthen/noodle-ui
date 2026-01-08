import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const q = searchParams.get("q") || ""
    const limit = searchParams.get("limit") || "20"
    const page = searchParams.get("page") || "1"

    const apiInternal = process.env.API_INTERNAL_URL;
    const backendUrl = `${apiInternal}/noodle/stablecoins?q=${q}&limit=${limit}&page=${page}`;
    const res = await fetch(backendUrl, {
        cache: "no-store",
    });

    const text = await res.text();
    console.log("⬅️ RAW RESPONSE:", text);

    if (!res.ok) {
        throw new Error(`Backend error ${res.status}: ${text}`);
    }
    return NextResponse.json(JSON.parse(text));
}