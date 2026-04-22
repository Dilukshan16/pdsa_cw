import { NextResponse } from "next/server";

const CANDIDATE_BACKEND_URLS = [
  process.env.MINIMUM_COST_API_BASE_URL,
  "http://127.0.0.1:8080",
  "http://localhost:8080",
].filter(Boolean) as string[];

async function proxyPlayRound() {
  let lastError: unknown;

  for (const baseUrl of CANDIDATE_BACKEND_URLS) {
    try {
      return await fetch(`${baseUrl}/minimum-cost/play-round`, {
        method: "GET",
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Unable to reach minimum-cost backend.");
}

export async function GET() {
  try {
    const backendResponse = await proxyPlayRound();

    const payload = await backendResponse.json();

    return NextResponse.json(payload, { status: backendResponse.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unable to play minimum cost round." }, { status: 500 });
  }
}