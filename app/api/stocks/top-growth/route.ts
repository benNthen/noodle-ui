import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiInternal = process.env.API_INTERNAL_URL;
        const backendUrl = `${apiInternal}/noodle/top-growth-stocks`;
        const res = await fetch(backendUrl, {
            cache: "no-store",
        });

        const text = await res.text();
        console.log("⬅️ RAW RESPONSE:", text);

        if (!res.ok) {
            throw new Error(`Backend error ${res.status}: ${text}`);
        }
        return NextResponse.json(JSON.parse(text));
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}