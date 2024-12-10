"use client";
import "@telegram-apps/telegram-ui/dist/styles.css";
import { AppRoot, Placeholder } from "@telegram-apps/telegram-ui";
import Image from "next/image";

export default function Statistics() {
  return (
    <div className="text-sm" style={{ color: "white" }}>
      <AppRoot>
        <Placeholder description="Вы зашли в статистику 🫥">
          {" "}
          <Image
            src="your-source"
            alt="your-alt-text"
            width={24}
            height={24}
            priority={false}
          />
        </Placeholder>
      </AppRoot>
    </div>
  );
}
