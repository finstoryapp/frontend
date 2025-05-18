import { createPortal } from "react-dom";
import styles from "./DeleteExpenseWindow.module.css";
import { useSelector, useDispatch } from "react-redux";
import { closeDeleteExpenseWindow } from "@/store/slices/expensesSlice/expensesSlice";
import { expensesState } from "@/store/slices/expensesSlice/expensesState";
import { ClipLoader } from "react-spinners";
import { useDeleteExpense } from "@/hooks/expenses/useDeleteExpense";
import { useExpenses } from "@/hooks/expenses/useExpenses";
import { accountsState } from "@/store/slices/accountsSlice/accountsState";
import { useAccounts } from "@/hooks/accounts/useAccounts";
import { useUser } from "@/hooks/user/useUser";
import { useRates } from "@/hooks/accounts/useRates";

export const DeleteExpenseWindow: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedExpenseId } = useSelector(expensesState);
  const { currentAccountIndex } = useSelector(accountsState);

  const deleteExpense = useDeleteExpense();
  const { data: expenses } = useExpenses();
  const { data: accounts } = useAccounts();
  const { data: user } = useUser();
  const { data: rates } = useRates();
  const isDeletingExpense = deleteExpense.isPending;

  const expense = expenses?.find((expense) => expense.id === selectedExpenseId);
  const amount = Number(expense?.amount);

  const currency = accounts![currentAccountIndex].currency;
  const defaultCurrency = user?.defaultCurrency;

  const date = new Date(
    expense?.createdAt ? +expense?.createdAt : 0
  ).toLocaleString();

  const rate = rates?.find((rate) => rate.currency === currency);

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
        <p className={styles.data}>
          <span>{amount}</span> <span>{currency}</span>{" "}
          {!rate?.currency ? null : (
            <>
              (
              <span className={styles.rate}>
                {rate?.rate ? (amount / rate?.rate).toFixed(2) : null}
              </span>{" "}
              <span>{defaultCurrency}</span>)
            </>
          )}
        </p>
        <p className={styles.date}>{date}</p>
        <hr className={styles.line} />
        <h3>Удалить запись?</h3>
        <div className={styles.buttons}>
          <button
            className={isDeletingExpense ? styles.disabled : ""}
            onClick={() => dispatch(closeDeleteExpenseWindow())}
          >
            Отменить
          </button>

          <button onClick={() => deleteExpense.mutate(selectedExpenseId)}>
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
