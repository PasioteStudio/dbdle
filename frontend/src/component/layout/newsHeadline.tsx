"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function NewsHeadline() {
  const [news, setNews] = useState<string | null>(null);

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_HOST;
    if (!apiBaseUrl) {
      console.error("NEXT_PUBLIC_HOST is not configured; cannot check API news.");
      return;
    }

    const controller = new AbortController();
    const url = `${apiBaseUrl.replace(/\/+$/, "")}/`;

    async function checkApiNews() {
      try {
        const response = await axios.get<string>(url, {
          signal: controller.signal,
          responseType: "text",
          validateStatus: (status) =>
            status === 200 || status === 500,
        });

        if (response.status !== 500) {
          return;
        }

        setNews(response.data);
      } catch (error) {
        if (axios.isCancel(error) || controller.signal.aborted) {
          return;
        }
        console.error("Failed to check API news");
      }
    }

    void checkApiNews();
    return () => controller.abort();
  }, []);

  if (!news) {
    return null;
  }

  return (
    <aside
      role="alert"
      className="w-full flex items-center justify-center bg-orange-500 px-4 py-3 text-center text-black"
    >
      <h2 className="text-lg font-bold">News:</h2>
      <p className="whitespace-pre-wrap"> {news}</p>
    </aside>
  );
}
