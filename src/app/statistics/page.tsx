"use client";
import "@telegram-apps/telegram-ui/dist/styles.css";
import { AppRoot, Placeholder } from "@telegram-apps/telegram-ui";
import Image from "next/image";

export default function Statistics() {
  return (
    <div className="text-sm" style={{ color: "white" }}>
      <AppRoot>
        <Placeholder description="Учитывайте расходы, чтобы увидеть статистику">
          {" "}
          <Image
            src="/gifs/statistics.gif"
            alt="your-alt-text"
            width={100}
            height={100}
            priority={false}
          />
        </Placeholder>
      </AppRoot>
    </div>
  );
}
