"use client";
import "@telegram-apps/telegram-ui/dist/styles.css";
import Image from "next/image";

export default function Statistics() {
  return (
    <div className="text-sm" style={{ color: "white" }}>
      {" "}
      <Image
        src="/gifs/statistics.gif"
        alt="your-alt-text"
        width={100}
        height={100}
        priority={false}
      />
    </div>
  );
}
