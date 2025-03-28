import { IUser } from "@/store/slices/userSlice/userSlice";
import styles from "./Subscription.module.css";
import React from "react";

interface subscriptionInterface {
  onClose: () => void;
  userData: IUser | null;
}

const Subscription: React.FC<subscriptionInterface> = ({
  onClose,
  userData,
}) => {
  const isUserHasSubscription = userData?.premiumUntil === null ? false : true;
  return (
    <div className={styles.subscription}>
      {isUserHasSubscription ? (
        <div className={styles.main}>
          <h1 className={styles.heading}>Управление подпиской</h1>
          <p className={styles.until}>
            Подписка действует до
            <span>
              13.04.2025
              <img src="/icons/correct.png" alt="correct" />
            </span>
          </p>
          <button className={styles.done} onClick={onClose}>
            Готово
          </button>
        </div>
      ) : (
        <>нету подписки</>
      )}
      <div className={styles.overlay} onClick={onClose}></div>
    </div>
  );
};

export default Subscription;
