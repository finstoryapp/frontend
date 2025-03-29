"use client";

import styles from "./home.module.css";
import { authUser } from "@/api/userApi";

const Home = () => {
  authUser();
  return (
    <div className={styles.hello}>
      <p>Домашняя страница</p>
    </div>
  );
};

export default Home;
