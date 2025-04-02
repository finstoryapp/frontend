import styles from "./ExpensesContainer.module.css";
import AccountsWrapper from "@/components/AccountWrapper/AccountWrapper";

export const ExpensesContainer: React.FC = () => {
  return (
    <div className={styles.expenses}>
      <AccountsWrapper />
    </div>
  );
};

export default ExpensesContainer;
