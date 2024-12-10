"use client";
import { retrieveLaunchParams, parseInitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { fetchUtil } from "../utils/utilFetch";

export default function Me() {
  const [name, setName] = useState<string | undefined>();
  const [id, setId] = useState<number | string | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeUser() {
      try {
        const { initDataRaw } = retrieveLaunchParams();
        const initData = parseInitData(initDataRaw);

        setName(initData.user?.firstName);
        setId(initData.user?.id);

        const loginData = await fetchUtil("auth/login", {
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
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  if (error) {
    return <div className="text-sm text-white">Error: {error}</div>;
  }

  return (
    <div
      className="text-sm"
      style={{ backgroundColor: "transparent", color: "white" }}
    >
      <code>Welcome back, ваше имя: </code>
      <code className="font-mono font-bold">{name ? name : ""}</code>
      <div>
        <code>Ваш id: </code>
        <code className="font-mono font-bold">{id ? id : ""}</code>
        <hr />
      </div>
      <div>
        <code style={{ display: "block" }}>Сообщение с сервера: </code>
        <br />
        <code className="font-mono font-bold">{message ? message : ""}</code>
      </div>
    </div>
  );
}
