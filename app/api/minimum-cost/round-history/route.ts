import { NextResponse } from "next/server";

const CANDIDATE_BACKEND_URLS = [
  process.env.MINIMUM_COST_API_BASE_URL,
  "http://127.0.0.1:8080",
  "http://localhost:8080",
].filter(Boolean) as string[];

async function proxyRoundHistory(page: string, size: string) {
  let lastError: unknown;

  for (const baseUrl of CANDIDATE_BACKEND_URLS) {
    try {
      return await fetch(`${baseUrl}/minimum-cost/round-history?page=${page}&size=${size}`, {
        cache: "no-store",
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Unable to reach minimum-cost backend.");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "0";
    const size = searchParams.get("size") ?? "10";

    const backendResponse = await proxyRoundHistory(page, size);

    const payload = await backendResponse.json();

    return NextResponse.json(payload, { status: backendResponse.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to load minimum cost history." }, { status: 500 });
  }
}