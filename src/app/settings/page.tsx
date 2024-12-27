"use client";
import styles from "./settings.module.css";

export default function Settings() {
  return (
    <div
      className={`text-sm ${styles.settingsWrapper}`}
      style={{ color: "white", textAlign: "center" }}
    >
      <div className={styles.settings}>
        <div className={styles.setting}>
          <button>
            {" "}
            <p>Категории</p>
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L7 7L1 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className={`${styles.setting} ${styles.disabled}`}>
          <button>
            {" "}
            <p>Подписка (скоро)</p>
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L7 7L1 13"
                stroke="#3582ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>{" "}
        <div className={styles.setting}>
          <a href="https://t.me/finstorychat">
            <button>
              {" "}
              <p>Сообщить об ошибке</p>
              <svg
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L7 7L1 13"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </a>
        </div>
        <div className={styles.setting}>
          <button>
            {" "}
            <p>Скачать данные</p>
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L7 7L1 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className={styles.designer}>
        <svg
          width="30"
          height="24"
          viewBox="0 0 30 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.15593 8.28106C8.44588 7.4975 9.55412 7.4975 9.84407 8.28106L11.2872 12.1811C11.3784 12.4274 11.5726 12.6216 11.8189 12.7128L15.7189 14.1559C16.5025 14.4459 16.5025 15.5541 15.7189 15.8441L11.8189 17.2872C11.5726 17.3784 11.3784 17.5726 11.2872 17.8189L9.84407 21.7189C9.55412 22.5025 8.44588 22.5025 8.15593 21.7189L6.7128 17.8189C6.62164 17.5726 6.42741 17.3784 6.18107 17.2872L2.28106 15.8441C1.4975 15.5541 1.4975 14.4459 2.28106 14.1559L6.18107 12.7128C6.42741 12.6216 6.62164 12.4274 6.7128 12.1811L8.15593 8.28106Z"
            fill="#3582FF"
          />
          <path
            d="M22.9842 2.39398C23.1614 1.91514 23.8386 1.91514 24.0158 2.39398L24.8977 4.77732C24.9534 4.92786 25.0721 5.04656 25.2227 5.10227L27.606 5.98418C28.0849 6.16137 28.0849 6.83863 27.606 7.01582L25.2227 7.89773C25.0721 7.95344 24.9534 8.07214 24.8977 8.22268L24.0158 10.606C23.8386 11.0849 23.1614 11.0849 22.9842 10.606L22.1023 8.22268C22.0466 8.07214 21.9279 7.95344 21.7773 7.89773L19.394 7.01582C18.9151 6.83863 18.9151 6.16137 19.394 5.98418L21.7773 5.10227C21.9279 5.04656 22.0466 4.92786 22.1023 4.77732L22.9842 2.39398Z"
            fill="#3582FF"
          />
        </svg>
        <span>Дизайн приложения</span>
        <a href="https://t.me/Twin_7">@Twin_7</a>
      </div>
      <span className={styles.version}>Версия: v0.6.0</span>
    </div>
  );
}
