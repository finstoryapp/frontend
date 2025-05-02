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
import { useUser } from "@/hooks/user/useUser";
import { useExpenses } from "@/hooks/expenses/useExpenses";
import { getFullMonthExpensesSum } from "@/utils/getFullMonthExpensesSum";
import { useAccounts } from "@/hooks/accounts/useAccounts";
import { useRates } from "@/hooks/accounts/useRates";

const ExpensesNavbar: React.FC = () => {
  const { data: user } = useUser();
  const { data: accounts } = useAccounts();
  const { data: rates } = useRates();
  const { data: expenses } = useExpenses();

  const defaultCurrency = user?.defaultCurrency;
  const expensesNavbar = useSelector(expensesNavbarState);
  const dispatch = useDispatch();
  const { refetch } = useExpenses();

  return (
    <div className={styles.expensesNavbar}>
      <div className={styles.month}>
        <button
          className={styles.prevMonthBtn}
          onClick={() => {
            dispatch(prevMonth());
            refetch();
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
            refetch();
          }}
        >
          <NextButtonSvg />
        </button>
      </div>
      <div className={styles.sum}>
        <p className={styles.sumText}>Расход за месяц</p>
        <p className={styles.sumValue}>
          {parseFloat(
            getFullMonthExpensesSum({
              accounts: accounts!,
              expenses: expenses!,
              rates: rates!,
              defaultCurrency: user?.defaultCurrency!,
            }).toFixed(2)
          )}
          <span className={styles.sumCurrency}> {defaultCurrency}</span>
        </p>
      </div>
    </div>
  );
};

export default ExpensesNavbar;
