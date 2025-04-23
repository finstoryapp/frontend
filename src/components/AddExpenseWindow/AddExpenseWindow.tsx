import Image from "next/image";
import styles from "./AddExpensesWindow.module.css";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setAddExpenseWindow } from "@/store/slices/expensesSlice/expensesSlice";
import { useEffect, useRef, useState } from "react";
import { accountState } from "@/store/slices/accountsSlice/accountSelectors";
import { getWeekDays } from "@/utils/getWeekDays";
import { userState } from "@/store/slices/userSlice/userSelectors";
import { useDraggable } from "react-use-draggable-scroll";
import { addNewExpense } from "@/store/slices/expensesSlice/expensesThunks";
import { expensesState } from "@/store/slices/expensesSlice/expensesState";
import { ClipLoader } from "react-spinners";
import { EXPENSE_MAX_AMOUNT } from "@/app/constants";
import { getFullMonthAccountSum } from "@/utils/getFullMonthAccountSum";

export const AddExpenseWindow: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const accounts = useSelector(accountState).accounts;
  const currentAccountIndex = useSelector(accountState).currentAccountIndex;
  const user = useSelector(userState);
  const expenses = useSelector(expensesState);

  const currentAccountName = accounts![currentAccountIndex].accountName;
  const currentAccountCurrency = accounts![currentAccountIndex].currency;
  const ccurrentAccountId = accounts![currentAccountIndex].accountId;
  const [currentSelectedDayIndex, setCurrentSelectedDayIndex] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expenseValue, setExpenseValue] = useState(0);

  // Used for make categories menu draggable
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);

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

  // Close the Add Expense Window by "W" key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyW") {
        dispatch(setAddExpenseWindow(false));
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Add expense by "Enter" key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Enter" && selectedCategory && expenseValue > 0) {
        dispatch(
          addNewExpense({
            amount: expenseValue,
            accountId: +ccurrentAccountId,
            categoryName: selectedCategory,
            time: getWeekDays().reverse()[currentSelectedDayIndex].unix,
          })
        );
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCategory, expenseValue]);

  // Drag categories by mouse wheel
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let scrollAmount = 0;
    let isScrolling = false;

    const smoothScroll = () => {
      if (scrollAmount === 0) {
        isScrolling = false;
        return;
      }

      const step = scrollAmount * 0.05; // 5% each frame
      el.scrollLeft += step;
      scrollAmount -= step;

      requestAnimationFrame(smoothScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollAmount += e.deltaY;

        if (!isScrolling) {
          isScrolling = true;
          requestAnimationFrame(smoothScroll);
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Disable scrolling on mount
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      // Restore scrolling on unmount
      document.body.style.overflow = "";
    };
  }, []);

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
            {user?.userData!.categories.map((category) => (
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
            if (
              selectedCategory &&
              expenseValue > 0 &&
              !expenses.isAddingExpense
            ) {
              dispatch(
                addNewExpense({
                  amount: expenseValue,
                  accountId: +ccurrentAccountId,
                  categoryName: selectedCategory,
                  time: getWeekDays().reverse()[currentSelectedDayIndex].unix,
                })
              );
            }
          }}
        >
          {expenses.isAddingExpense ? (
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
