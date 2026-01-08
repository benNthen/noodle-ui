import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";
    const page = searchParams.get("page") || "1";
    const groupFilter = searchParams.get("groupFilter") || "";

    const apiInternal = process.env.API_INTERNAL_URL;
    const backendUrl = `${apiInternal}/noodle/commodities?limit=${limit}&page=${page}&groupFilter=${groupFilter}`;
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