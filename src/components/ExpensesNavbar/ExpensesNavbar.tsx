import { expensesNavbarState } from "@/store/slices/expensesNavbarSlice/expensesNavbarState";
import styles from "./ExpensesNavbar.module.css";
import NextButtonSvg from "@/svg/NextButtonSvg";
import PrevButtonSvg from "@/svg/PrevButtonSvg";
import { useSelector, useDispatch } from "react-redux";
import {
  nextMonth,
  prevMonth,
} from "@/store/slices/expensesNavbarSlice/expensesNavbarSlice";
import { russianMonths } from "@/app/constants";
import { fetchExpenses } from "@/store/slices/expensesSlice/expensesThunks";
import { AppDispatch } from "@/store/store";
import { userState } from "@/store/slices/userSlice/userSelectors";
import { getFullMonthExpensesSum } from "@/utils/getFullMonthExpensesSum";

const ExpensesNavbar: React.FC = () => {
  const expensesNavbar = useSelector(expensesNavbarState);
  const defaultCurrency = useSelector(userState).userData?.defaultCurrency;
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className={styles.expensesNavbar}>
      <div className={styles.month}>
        <button
          className={styles.prevMonthBtn}
          onClick={() => {
            dispatch(prevMonth());
            dispatch(fetchExpenses());
          }}
        >
          <PrevButtonSvg />
        </button>
        <p className={styles.date}>
          {russianMonths[expensesNavbar.month]} {expensesNavbar.year}
        </p>
        <button
          className={styles.nextMonthBtn}
          style={!expensesNavbar.isCurrentMonth ? {} : { visibility: "hidden" }}
          onClick={() => {
            dispatch(nextMonth());
            dispatch(fetchExpenses());
          }}
        >
          <NextButtonSvg />
        </button>
      </div>
      <div className={styles.sum}>
        <p className={styles.sumText}>Расход за месяц</p>
        <p className={styles.sumValue}>
          {parseFloat(getFullMonthExpensesSum().toFixed(2))}
          <span className={styles.sumCurrency}> {defaultCurrency}</span>
        </p>
      </div>
    </div>
  );
};

export default ExpensesNavbar;
