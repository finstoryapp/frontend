import PrevButtonSvg from "@/svg/PrevButtonSvg";
import NextButtonSvg from "@/svg/NextButtonSvg";
import styles from "./StatisticsNavbar.module.css";
import { expensesNavbarState } from "@/store/slices/expensesNavbarSlice/expensesNavbarState";
import { useDispatch, useSelector } from "react-redux";
import { russianMonths } from "@/app/constants";
import { StatisticsNavbarProps } from "@/types/propsTypes";
import { useAccounts } from "@/hooks/accounts/useAccounts";
import { useExpenses } from "@/hooks/expenses/useExpenses";
import {
  nextMonth,
  prevMonth,
} from "@/store/slices/expensesNavbarSlice/expensesNavbarSlice";

const StatisticsNavbar: React.FC<StatisticsNavbarProps> = (props) => {
  const { onClickPrevAccount, onClickNextAccount, currentStatistics } = props;
  const expensesNavbar = useSelector(expensesNavbarState);
  const { data: accounts } = useAccounts();

  const dispatch = useDispatch();
  const { refetch } = useExpenses();
  return (
    <div className={styles.container}>
      <div className={`${styles.switcher} ${styles.date}`}>
        <PrevButtonSvg
          style={{ cursor: "pointer" }}
          onClick={() => {
            dispatch(prevMonth());
            refetch();
          }}
        />
        {russianMonths[expensesNavbar.month]} {expensesNavbar.year}
        <NextButtonSvg
          style={
            !expensesNavbar.isCurrentMonth
              ? { cursor: "pointer" }
              : { visibility: "hidden" }
          }
          onClick={() => {
            dispatch(nextMonth());
            refetch();
          }}
        />
      </div>
      <div className={styles.switcher}>
        <PrevButtonSvg
          style={{ cursor: "pointer" }}
          onClick={() => {
            onClickPrevAccount();
          }}
        />
        {currentStatistics === 0
          ? "Все счета"
          : String(accounts![currentStatistics - 1].accountName)}
        <NextButtonSvg
          style={{ cursor: "pointer" }}
          onClick={() => onClickNextAccount()}
        />
      </div>
    </div>
  );
};
export default StatisticsNavbar;

//! COMPLETE IT
