import { NextResponse } from "next/server";
import { fetchEventSource } from "@fortaine/fetch-event-source";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();
  const abortController = new AbortController();

  const url = "http://localhost:5000/api/test-sse";

  req.signal.addEventListener("abort", () =>
    (async () => {
      console.log("stream request aborted by client");
      await writer.close();
      abortController.abort();
    })()
  );

  fetchEventSource(url, {
    headers: { Accept: "application/json" },
    method: "POST",
    signal: abortController.signal,

    async onmessage(event) {
      if (event.data === "" || !event.data) return;
      void (await writer.write(
        encoder.encode(`event: message\ndata: ${event.data}\n\n`)
      ));
    },
    async onerror() {
      console.error("stream from api failed");
      await void writer.close();
    },
    async onclosed() {
      console.log("stream from api closed");
      await void writer.close();
    },
    async onopen(res) {
      console.log("stream from api opened", res);
    },
  });

  return new NextResponse(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
