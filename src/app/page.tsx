"use client";

import { retrieveLaunchParams } from "@telegram-apps/sdk";

export default function Me() {
  const { initDataRaw } = retrieveLaunchParams();

  console.log(typeof initDataRaw);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const response = fetch("http://127.0.0.1:3001/auth/login", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({ initData: initDataRaw }),
  });

  return (
    <div className="text-sm">
      <code>Welcome back </code>
      <code className="font-mono font-bold">@{initDataRaw}</code>
    </div>
  );
}
