export async function GET(req: Request) {

  const res = await fetch(
    `http://localhost:8080/queens/last-sequential-time`,
    {
      method: "GET",
    }
  );

  const data = await res.text();

  console.log("Sequential execution time:", data);

  return new Response(JSON.stringify({ message: data }), {
    headers: { "Content-Type": "application/json" },
  });
}