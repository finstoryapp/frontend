import { russianDayNames } from "@/app/constants";
import styles from "./ExpensesContainer.module.css";
import AccountsWrapper from "@/components/AccountWrapper/AccountWrapper";
import { accountState } from "@/store/slices/accountsSlice/accountSelectors";
import { expensesState } from "@/store/slices/expensesSlice/expensesState";
import { userState } from "@/store/slices/userSlice/userSelectors";
import { useSelector, useDispatch } from "react-redux";
import RightArrowLightBlue from "@/svg/RightArrowLightBlue";
import { ClipLoader } from "react-spinners";
import { openDeleteExpenseWindow } from "@/store/slices/expensesSlice/expensesSlice";

export const ExpensesContainer: React.FC = () => {
  const dispatch = useDispatch();
  const expenses = useSelector(expensesState);
  const accounts = useSelector(accountState);
  const user = useSelector(userState);
  const expensesList = expenses.expenses;

  return (
    <div className={styles.expenses}>
      <AccountsWrapper />
      {expenses.loadingExpenses ? (
        <div className={styles.loader}>
          <ClipLoader
            color="var(--text-color)"
            size={"32px"}
            speedMultiplier={1.5}
          />
        </div>
      ) : (
        <div className={styles.expensesContainer}>
          {/* List of expenses */}
          {expensesList && expensesList.length ? (
            <>
              {expensesList
                .filter((expense) => expense?.createdAt)
                .filter(
                  (expense) =>
                    expense.accountId ===
                    accounts.accounts![accounts.currentAccountIndex].accountId
                )
                .sort((a, b) => {
                  const dateA = +a.createdAt;
                  const dateB = +b.createdAt;
                  return dateB - dateA;
                })
                .map((expense) => {
                  const weekDayIndex = new Date(+expense.createdAt).getDay();
                  const dayNumber = new Date(+expense.createdAt).getDate();
                  const dayName = russianDayNames[weekDayIndex];
                  const categoryColor = user.userData?.categories.find(
                    (category) => category.name === expense.categoryName
                  )?.color;

                  return (
                    <div className={styles.expenseItem} key={expense.id}>
                      <p className={styles.expenseItemDate}>
                        {`${dayNumber} ${dayName}`}
                      </p>
                      <p className={styles.expenseItemAmount}>
                        {Math.round(+expense.amount * -1000) / 1000}
                      </p>
                      <div className={styles.expenseItemCategory}>
                        <div
                          className={styles.expenseItemCategoryCircle}
                          style={{
                            backgroundColor: `#${categoryColor}`,
                          }}
                        ></div>
                        <span>{expense.categoryName}</span>
                      </div>
                      <button
                        className={styles.expenseItemButton}
                        onClick={() => {
                          dispatch(openDeleteExpenseWindow(expense.id));
                        }}
                      >
                        <RightArrowLightBlue />
                      </button>
                    </div>
                  );
                })}
            </>
          ) : (
            <p>Добавляйте расходы и они появятся.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpensesContainer;
