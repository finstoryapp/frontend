import styles from "./AddButton.module.css";
import Image from "next/image";
import { AddButtonProps } from "@/types/propsTypes";

export const AddButton: React.FC<AddButtonProps> = ({ text, onClick }) => {
  return (
    <div className={styles.buttonWrapper}>
      <button className={styles.button} onClick={onClick}>
        {text}
        <Image src={"/icons/plus.svg"} alt="plus" width={24} height={24} />
      </button>
    </div>
  );
};

export default AddButton;
