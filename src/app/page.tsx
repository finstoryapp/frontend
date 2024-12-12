"use client";
import { retrieveLaunchParams, parseInitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { fetchUtil } from "../utils/utilFetch";
import { Spinner } from "@nextui-org/react";
export default function Me() {
  const [message, setMessage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeUser() {
      try {
        const { initDataRaw } = retrieveLaunchParams();

        await fetchUtil("auth/login", {
          method: "POST",
          body: JSON.stringify({ initData: initDataRaw }),
        });

        const userData = await fetchUtil("api/me", {
          method: "GET",
        });

        setMessage(JSON.stringify(userData));
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
      }
    }

    initializeUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-white">Error: {error}</div>;
  }

  return (
    <div
      className="text-sm"
      style={{ backgroundColor: "transparent", color: "white" }}
    >
      <div>
        <code style={{ display: "block" }}>Сообщение с сервера: </code>
        <br />
        <code className="font-mono font-bold">{message ? message : ""}</code>
      </div>
    </div>
  );
}
