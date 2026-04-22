export async function GET(req: Request) {

  const res = await fetch(
    `http://localhost:8080/queens/last-parallel-time`,
    {
      method: "GET",
    }
  );

  const data = await res.text();

  return new Response(JSON.stringify({ message: data }), {
    headers: { "Content-Type": "application/json" },
  });
}