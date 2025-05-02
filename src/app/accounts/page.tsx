"use client";

import styles from "./accounts.module.css";
import { DefaultCurrencyList } from "@/components/DefaultCurrencyList/DefaultCurrencyList";

const Accounts = () => {
  return (
    <div className={styles.container}>
      <DefaultCurrencyList />
    </div>
  );
};

export default Accounts;
