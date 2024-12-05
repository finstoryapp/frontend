"use client";
import { retrieveLaunchParams, parseInitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { fetchUtil } from "../utils/utilFetch"; // Import the utility function

export default function Me() {
  const [name, setName] = useState<string | undefined>();
  const [id, setId] = useState<number | string | undefined>();
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    const { initDataRaw } = retrieveLaunchParams();
    const initData = parseInitData(initDataRaw);

    setName(initData.user?.firstName);
    setId(initData.user?.id);

    // Use fetchUtil for login request
    fetchUtil("auth/login", {
      method: "POST",
      body: JSON.stringify({ initData: initDataRaw }),
    })
      .then((data) => {
        console.log("Login Success:", data);
      })
      .catch((error) => {
        console.error("Login Error:", error);
      });

    // Use fetchUtil for the 'me' request
    fetchUtil("auth/me", {
      method: "GET",
    })
      .then((data) => {
        setMessage(data["message"]);
        console.log("Me Success:", data);
      })
      .catch((error) => {
        console.error("Me Error:", error);
      });
  }, []);

  return (
    <div
      className="text-sm"
      style={{ backgroundColor: "white", color: "black" }}
    >
      <code>Welcome back, ваше имя: </code>
      <code className="font-mono font-bold">{name ? name : ""}</code>
      <div>
        <code>Ваш id: </code>
        <code className="font-mono font-bold">{id ? id : ""}</code>
      </div>
      <div>
        <code>Сообщение с сервера: </code>
        <code className="font-mono font-bold">{message ? message : ""}</code>
      </div>
    </div>
  );
}
