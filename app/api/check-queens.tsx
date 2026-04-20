import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { search } = Object.fromEntries(new URL(req.url).searchParams);

    if (!search) {
      return NextResponse.json({ message: "Missing search query" }, { status: 400 });
    }

    // Call NestJS backend
    const backendRes = await fetch(
      `http://localhost:3002/location/cities?search=${encodeURIComponent(search)}`
    );

    if (!backendRes.ok) {
      return NextResponse.json({ message: "Backend error" }, { status: backendRes.status });
    }

    const data = await backendRes.json();

    // Ensure data is always an array
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}