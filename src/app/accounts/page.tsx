"use client";
import { CustomButton } from "@/components/AddButton/CustomButton";
import styles from "./page.module.css";

export default function Accounts() {
  const handleAddClick = () => {
    console.log("Add button clicked");
  };

  return (
    <div className={styles.container}>
      <CustomButton onClick={handleAddClick}>Добавить счёт</CustomButton>
    </div>
  );
}
