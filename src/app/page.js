"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [sseData, setSSEData] = useState([]);
  const eventSource = new EventSource("/api/test-sse", {
    withCredentials: true,
  });

  useEffect(() => {
    eventSource.onmessage = (event) => {
      console.log(event.data)
      setSSEData([...sseData, JSON.parse(event.data)]);
    };

    eventSource.onerror = (error) => {
      console.log("The following error has occurred: ", error);
    }

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
};

