import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export default async function GET(req) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  const data = await fetch("http://localhost:5000/api/test-sse");

  writer.write(encoder.encode("data: " + JSON.stringify(data) + "\n\n"));

  return new NextResponse(stream.readable, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
