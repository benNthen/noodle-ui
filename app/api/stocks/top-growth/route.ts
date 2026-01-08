import { NextResponse } from "next/server";

export async function GET() {
    try {
        const API_BASE_URL = process.env.API_INTERNAL_URL;

        if (!API_BASE_URL) {
            throw new Error("API_INTERNAL_URL is missing");
        }
        const backendUrl = `${API_BASE_URL}/noodle/top-growth-stocks`;

        const res = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 10 },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch Top Growth Commodities");
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}