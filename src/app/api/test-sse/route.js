export const runtime = "nodejs";

export const dynamic = "force-dynamic";

export default async function longRunningResponse(req, res) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();
  let closed = false;

  const eventSource = new EventSource("http://localhost:5000/api/test-sse"); // Renamed to eventSource

  eventSource.onmessage = (e) => {
    console.log(data);
    writer.write(encoder.encode("data: " + e.data + "\n\n"));
  };

  eventSource.onerror = async () => {
    eventSource.close();
  };

  req.socket.on("close", () => {
    eventSource.close();
    res.end();
  });

  return new Response(responseStream.readable, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/event-stream; charset=utf-8",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      "Content-Encoding": "none",
    },
  });
}


