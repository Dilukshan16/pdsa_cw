import { Agent, setGlobalDispatcher } from 'undici';

// Set a massive timeout (e.g., 10 minutes)
setGlobalDispatcher(new Agent({ headersTimeout: 900000, bodyTimeout: 900000 }));

export async function GET(req: Request) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 1000 * 60 * 20); // 20 minutes

  try {
    const res = await fetch(
      "http://localhost:8080/queens/solve-parallel",
      {
        method: "GET",
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    const data = await res.json();
    console.log("Parallel solution response:", data);

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Request Timeout" }, { status: 500 });
  }
}