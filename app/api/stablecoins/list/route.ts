import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const q = searchParams.get("q") || ""
    const limit = searchParams.get("limit") || "20"
    const page = searchParams.get("page") || "1"

    const API_BASE_URL = process.env.API_INTERNAL_URL;

    if (!API_BASE_URL) {
        throw new Error("API_INTERNAL_URL is missing");
    }

    const url = `${API_BASE_URL}/noodle/stablecoins?q=${q}&limit=${limit}&page=${page}`

    const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
    })

    if (!res.ok) {
        return NextResponse.json(
            { message: "Failed to fetch stablecoins" },
            { status: res.status }
        )
    }

    const data = await res.json()
    return NextResponse.json(data)
}