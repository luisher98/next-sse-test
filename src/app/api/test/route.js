export async function handler(req, res) {
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Encoding": "none",
    "Cache-Control": "no-cache, no-transform",
    "Content-Type": "text/event-stream",
  });

  const eventSource = new EventSource("http://localhost:5000/api/test-sse"); // Renamed to eventSource

  eventSource.onmessage = (e) => {
    console.log(data);
    res.write(`event: message\ndata: ${e.data}\n\n`);
  };

  eventSource.onerror = async () => {
    eventSource.close();
  };

  req.socket.on("close", () => {
    eventSource.close();
    res.end();
  });
}
