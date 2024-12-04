"use client";

import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";

export default function Me() {
  const { initDataRaw } = retrieveLaunchParams();
  const [message, setMessage] = useState("loading..");

  console.log(typeof initDataRaw);

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch("http://127.0.0.1:3001/auth/login", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ initData: initDataRaw }),
      credentials: "include",
    });

    fetch("http://127.0.0.1:3001/auth/me", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="text-sm" style={{ backgroundColor: "red" }}>
      <code>Welcome back </code>
      <code className="font-mono font-bold">{message}</code>
    </div>
  );
}
