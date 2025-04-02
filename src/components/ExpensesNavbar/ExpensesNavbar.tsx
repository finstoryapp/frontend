import styles from "./ExpensesNavbar.module.css";
import NextButtonSvg from "@/svg/NextButtonSvg";
import PrevButtonSvg from "@/svg/PrevButtonSvg";

const ExpensesNavbar: React.FC = () => {
  return (
    <div className={styles.expensesNavbar}>
      <div className={styles.month}>
        <button
          className={styles.prevMonthBtn}
          // onClick={() => goPrevMonth()}
        >
          <PrevButtonSvg />
        </button>
        <p className={styles.date}>
          {/* {russianMonths[date.month]} {date.year} */}
          Апрель 2025
        </p>
        <button
          className={styles.nextMonthBtn}
          // style={date.isPrevious ? {} : { visibility: "hidden" }}
          // onClick={() => goNextMonth()}
        >
          <NextButtonSvg />
        </button>
      </div>
      <div className={styles.sum}>
        <p className={styles.sumText}>Расход за месяц</p>
        <p className={styles.sumValue}>
          {/* {expenses ? -1 * fullSum : "~"}{" "} */}
          -0
          <span className={styles.sumCurrency}>
            USD
            {/* {userData?.defaultCurrency ?? "..."} */}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ExpensesNavbar;
