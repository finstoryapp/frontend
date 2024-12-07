"use client";
import "@telegram-apps/telegram-ui/dist/styles.css";
import { AppRoot, Placeholder } from "@telegram-apps/telegram-ui";

export default function Statistics() {
  return (
    <div className="text-sm" style={{ color: "black" }}>
      <AppRoot>
        <Placeholder
          header="Тут будет статистика"
          description="Добавляйте расходы и она появится"
        >
          <img
            alt="Telegram sticker"
            src="/gifs/statistics.gif"
            style={{ display: "block", width: "144px", height: "144px" }}
          />
        </Placeholder>
      </AppRoot>
    </div>
  );
}
