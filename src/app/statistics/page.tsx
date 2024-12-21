"use client";
import Image from "next/image";

export default function Statistics() {
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="text-sm font-medium text-foreground flex justify-center items-center mt-24">
        <Image
          src="/gifs/statistics.gif"
          alt="your-alt-text"
          width={100}
          height={100}
          priority={false}
        />
      </div>
      <p className="text-white text-center w-52">
        Статистика будет в следующем обновлении
      </p>
    </div>
  );
}
