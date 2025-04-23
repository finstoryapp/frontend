import { useDispatch } from "react-redux";
import styles from "./AddExpensesButton.module.css";
import Image from "next/image";
import { setAddExpenseWindow } from "@/store/slices/expensesSlice/expensesSlice";

export const AddExpensesButton: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.buttonWrapper}>
      <button
        className={styles.button}
        onClick={() => {
          dispatch(setAddExpenseWindow(true));
        }}
      >
        Добавить расход
        <Image src={"/icons/plus.svg"} alt="plus" width={24} height={24} />
      </button>
    </div>
  );
};

export default AddExpensesButton;
