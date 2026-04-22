export async function GET(req: Request) {
  try {
    const res = await fetch(
      "http://localhost:8080/queens/solve-sequential",
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }

    const data = await res.json();

    return Response.json({ status: data }, { status: 200 });

  } catch (error) {
    console.error("Sequential solver error:", error);

    return Response.json(
      { error: "Request Timeout or Backend Failed" },
      { status: 500 }
    );
  }
}