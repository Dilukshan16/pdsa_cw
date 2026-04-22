export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const playername = searchParams.get("playername");
    const answer = searchParams.get("answer");

    const res = await fetch(
      "http://localhost:8080/queens/play-game",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          playername: playername || "",
          answer: answer || "",
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }

    const data = await res.json();

    return Response.json({ status: data }, { status: 200 });

  } catch (error) {
    console.error("Play game error:", error);

    return Response.json(
      { error: "Request Timeout or Backend Failed" },
      { status: 500 }
    );
  }
}