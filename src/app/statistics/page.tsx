"use client";
import Image from "next/image";

export default function Statistics() {
  return (
    <div className="text-sm font-medium text-foreground">
      <p className="text-base font-semibold tracking-wide">p</p>
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
