import Image from "next/image";
import styles from "./AddExpensesWindow.module.css";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAddExpenseWindow } from "@/store/slices/expensesSlice/expensesSlice";
import { useEffect, useRef, useState } from "react";
import { accountsState } from "@/store/slices/accountsSlice/accountsState";
import { getWeekDays } from "@/utils/getWeekDays";
import { useDraggable } from "react-use-draggable-scroll";
import { ClipLoader } from "react-spinners";
import { EXPENSE_MAX_AMOUNT } from "@/app/constants";
import { getFullMonthAccountSum } from "@/utils/getFullMonthAccountSum";
import { useUser } from "@/hooks/user/useUser";
import { useAccounts } from "@/hooks/accounts/useAccounts";
import { useExpenses } from "@/hooks/expenses/useExpenses";
import { useAddExpense } from "@/hooks/expenses/useAddExpense";
import useScrollTabs from "@/hooks/component/useScrollTabs";
import useKeyPress from "@/hooks/component/useKeyPress";

export const AddExpenseWindow: React.FC = () => {
  const dispatch = useDispatch();
  const { currentAccountIndex } = useSelector(accountsState);

  const { data: user } = useUser();
  const { data: accounts } = useAccounts();
  const { data: expenses } = useExpenses();

  const { mutate: addExpense, isPending: isAddingExpense } = useAddExpense();

  const currentAccountName = accounts![currentAccountIndex].accountName;
  const currentAccountCurrency = accounts![currentAccountIndex].currency;
  const currentAccountId = accounts![currentAccountIndex].accountId;

  const [currentSelectedDayIndex, setCurrentSelectedDayIndex] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expenseValue, setExpenseValue] = useState(0);
  const { ref, events } = useScrollTabs();

  // Control the expense input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = Number(rawValue);

    // Validate: up to 3 decimal places only
    const isValid =
      /^(\d+)?(\.\d{0,3})?$/.test(rawValue) && !isNaN(numericValue);

    if (isValid) {
      if (numericValue < 0) {
        setExpenseValue(0);
      } else if (numericValue > EXPENSE_MAX_AMOUNT) {
        setExpenseValue(EXPENSE_MAX_AMOUNT);
      } else {
        setExpenseValue(numericValue);
      }
    }
  };

  useKeyPress({
    keys: ["KeyW", "Escape"],
    callback: () => dispatch(setAddExpenseWindow(false)),
  });

  useKeyPress({
    keys: ["Enter"],
    callback: () => {
      if (selectedCategory && expenseValue > 0) {
        addExpense({
          amount: expenseValue,
          accountId: +currentAccountId,
          categoryName: selectedCategory,
          time: getWeekDays().reverse()[currentSelectedDayIndex].unix,
        });
      }
    },
  });

  return createPortal(
    <div
      className={styles.addExpenseWrapper}
      onClick={() => dispatch(setAddExpenseWindow(false))}
    >
      <div
        className={styles.addExpense}
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          className={styles.closeButton}
          src={"/icons/close.svg"}
          alt="close"
          width={24}
          height={24}
          onClick={() => dispatch(setAddExpenseWindow(false))}
        />
        <h2 className={styles.heading}>Добавить расход</h2>
        <div className={styles.account}>
          <span className={styles.accountName}>{currentAccountName}</span>
          <div>
            <span className={styles.accountTotalExpenses}>
              {parseFloat(
                (
                  -1 *
                  getFullMonthAccountSum({
                    expenses: expenses!,
                    accountId: Number(accounts![currentAccountIndex].accountId),
                  })
                ).toFixed(2)
              )}
            </span>
            <span className={styles.accountCurrency}>
              {currentAccountCurrency}
            </span>
          </div>
        </div>
        <div className={styles.tabs}>
          {getWeekDays()
            .reverse()
            .map((day, index) => (
              <span
                key={day.unix}
                className={
                  index === currentSelectedDayIndex ? styles.activeTab : ""
                }
                onClick={() => setCurrentSelectedDayIndex(index)}
              >
                {day.date}
              </span>
            ))}
        </div>
        <div className={styles.categories}>
          <div className={styles.categoriesContainer} {...events} ref={ref}>
            {user?.categories.map((category) => (
              <span
                onClick={() => {
                  setSelectedCategory(category.name);
                }}
                className={`${styles.categoryItem} ${
                  selectedCategory === category.name ? styles.clicked : ""
                }`}
                key={category.name}
              >
                {category.name}
                <div
                  className={styles.categoryCircle}
                  style={{ backgroundColor: `#${category.color}` }}
                ></div>
              </span>
            ))}
          </div>
        </div>
        <div className={styles.inputExpenseContainer}>
          <input
            autoFocus
            value={expenseValue === 0 ? "" : expenseValue}
            type="number"
            placeholder={String(expenseValue)}
            onChange={handleChange}
            className={styles.inputExpense}
            max={EXPENSE_MAX_AMOUNT}
            aria-describedby="amount"
            inputMode="numeric" // Show numeric keyboard on mobile
            pattern="[0-9]*" // Allow only digits
            onKeyDown={(e) => {
              // Block unwanted keys like e, E, +, -
              if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </div>
        <button
          className={`${styles.addExpenseButton} ${
            selectedCategory && expenseValue > 0 ? styles.activeButton : ""
          }`}
          onClick={() => {
            if (selectedCategory && expenseValue > 0 && !isAddingExpense) {
              addExpense({
                amount: expenseValue,
                accountId: +currentAccountId,
                categoryName: selectedCategory,
                time: getWeekDays().reverse()[currentSelectedDayIndex].unix,
              });
            }
          }}
        >
          {isAddingExpense ? (
            <ClipLoader
              color="var(--text-color)"
              size={"16px"}
              speedMultiplier={1.5}
            />
          ) : (
            <>
              Добавить расход
              <Image
                src={"/icons/check.svg"}
                alt="check"
                width={24}
                height={24}
              />
            </>
          )}
        </button>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default AddExpenseWindow;
