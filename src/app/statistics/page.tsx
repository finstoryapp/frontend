"use client";
import Image from "next/image";

export default function Statistics() {
  return (
    <div className="text-sm font-medium text-foreground flex justify-center items-center">
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
