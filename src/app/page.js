"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [sseData, setSSEData] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/test-sse");
    eventSource.addEventListener("message", (event) => {
      setSSEData((prev) => [...prev, JSON.parse(event.data)]);
    });
    console.log("sseData:", sseData);
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>SSE Data:</h1>
      <ul>
        {sseData.map((data, index) => (
          <li key={index}>{data.message}</li>
        ))}
      </ul>
    </div>
  );
}
