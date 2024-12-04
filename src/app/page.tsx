"use client";
import { retrieveLaunchParams, parseInitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";

export default function Me() {
  const [name, setName] = useState<any>();
  const [id, setId] = useState<any>();
  useEffect(() => {
    const { initDataRaw } = retrieveLaunchParams();
    const initData = parseInitData(initDataRaw);

    setName(initData.user?.firstName);
    setId(initData.user?.id);

    let url = "";
    if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
      url = "http://127.0.0.1:3001/";
    } else {
      url = String(process.env.NEXT_PUBLIC_BACKEND_HOST);
    }
    fetch(url + "auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initData: initDataRaw }),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div
      className="text-sm"
      style={{ backgroundColor: "white", color: "black" }}
    >
      <code>Welcome back, ваше имя: {} </code>
      <code className="font-mono font-bold">{name ? name : ""}</code>
      <div>
        <code>Ваш id: </code>
        <code className="font-mono font-bold">{id ? id : ""}</code>
      </div>
    </div>
  );
}
