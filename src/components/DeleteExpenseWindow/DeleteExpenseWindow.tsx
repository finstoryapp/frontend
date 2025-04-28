import { createPortal } from "react-dom";
import styles from "./DeleteExpenseWindow.module.css";
import { useSelector, useDispatch } from "react-redux";
import { closeDeleteExpenseWindow } from "@/store/slices/expensesSlice/expensesSlice";
import { expensesState } from "@/store/slices/expensesSlice/expensesState";
import { deleteExpenseById } from "@/store/slices/expensesSlice/expensesThunks";
import { AppDispatch } from "@/store/store";
import { ClipLoader } from "react-spinners";

export const DeleteExpenseWindow: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedExpenseId, isDeletingExpense } = useSelector(expensesState);

  return createPortal(
    <div
      className={styles.wrapper}
      onClick={() => {
        if (!isDeletingExpense) {
          dispatch(closeDeleteExpenseWindow());
        }
      }}
    >
      <div
        className={styles.window}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h3>Удалить запись?</h3>
        <div className={styles.buttons}>
          <button
            className={isDeletingExpense ? styles.disabled : ""}
            onClick={() => dispatch(closeDeleteExpenseWindow())}
          >
            Отменить
          </button>
          <button
            onClick={() => dispatch(deleteExpenseById(selectedExpenseId))}
          >
            {isDeletingExpense ? (
              <ClipLoader
                color="var(--text-color)"
                size={"12px"}
                speedMultiplier={1.5}
              />
            ) : (
              "Удалить"
            )}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default DeleteExpenseWindow;
