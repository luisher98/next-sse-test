"use client";

import { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export default function Home() {
  const [sseData, setSSEData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchEventSource("/api/stream", {
        method: "POST",
        headers: { Accept: "application/json" },
        mode: "cors",
        onopen(res) {
          if (res.ok && res.status === 200) {
            console.info(`Connection made: ${res.status}`);
          }
        },
        onmessage(event) {
          console.log("event:", event.data);
          setSSEData((prevData) => [...prevData, { data: event.data }]);
        },
        onerror(err) {
          console.log("Stream failed", err);
        },
        onclosed() {
          console.log("Stream closed");
        },
      });
    };
    fetchData();
  }, []);

  console.log("sseData:", sseData);
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
