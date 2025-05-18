"use client";
import { SETTINGS } from "@/app/constants";
import styles from "./SettingsList.module.css";
import NextButtonSvg from "@/svg/NextButtonSvg";
import StarsSvg from "@/svg/StarsSvg";
import { init, openLink } from "@telegram-apps/sdk";

const SettingsList: React.FC = () => {
  return (
    <div className={styles.container}>
      {SETTINGS.map((setting) => {
        return (
          <button
            className={styles.setting}
            key={setting.name}
            onClick={() => {
              if (setting.function) {
                console.log(setting.function);
                setting.function();
              }
              if (setting.isExternal) {
                init();
                openLink("https://www.youtube.com/@finstoryapp", {});
              } else {
                if (setting.link) {
                  window.location.href = setting.link;
                }
              }
            }}
          >
            <p>{setting.name}</p>
            <NextButtonSvg />
          </button>
        );
      })}{" "}
      <div className={styles.designer}>
        <StarsSvg />
        <span>Дизайн приложения: </span>
        <a href="https://t.me/Twin_7">@Twin_7</a>
      </div>
      <p className={styles.version}>Версия: 2.0.0</p>
    </div>
  );
};

export default SettingsList;
