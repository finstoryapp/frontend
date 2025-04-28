"use client";

import styles from "./home.module.css";
import { fetchUser } from "@/store/slices/userSlice/userThunks";
import { AppDispatch } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { userState } from "@/store/slices/userSlice/userSelectors";
import { ExpensesContainer } from "@/components/ExpensesContainer/ExpensesContainer";
import { RotateLoader } from "react-spinners";
import { accountState } from "@/store/slices/accountsSlice/accountSelectors";
import { fetchAccounts } from "@/store/slices/accountsSlice/accountThunks";
import { useEffect } from "react";
import { fetchExpenses } from "@/store/slices/expensesSlice/expensesThunks";
import { expensesState } from "@/store/slices/expensesSlice/expensesState";
import ExpensesNavbar from "@/components/ExpensesNavbar/ExpensesNavbar";
import AddExpensesButton from "@/components/AddExpensesButton/AddExpensesButton";
import AddExpenseWindow from "@/components/AddExpenseWindow/AddExpenseWindow";
import { setAddExpenseWindow } from "@/store/slices/expensesSlice/expensesSlice";
import DeleteExpenseWindow from "@/components/DeleteExpenseWindow/DeleteExpenseWindow";

const Home = () => {
  const user = useSelector(userState);
  const accounts = useSelector(accountState);
  const expenses = useSelector(expensesState);
  const dispatch = useDispatch<AppDispatch>();

  // Fetch user's data and set cookies
  useEffect(() => {
    if (!user.userData) {
      dispatch(fetchUser());
    }
  }, [user.userData, dispatch]);

  // Fetch other data
  useEffect(() => {
    if (!accounts.accounts) {
      dispatch(fetchAccounts());
      dispatch(fetchExpenses());
    }
  }, [accounts.accounts, dispatch]);

  // Open "Add expense" modal window by "W" key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyW") {
        dispatch(setAddExpenseWindow(true));
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.home}>
      {user.loading ? (
        <div className={styles.loading}>
          <RotateLoader
            color="var(--text-color-secondary)"
            size={"12px"}
            speedMultiplier={1.5}
          />
        </div>
      ) : (
        <>
          <ExpensesNavbar />
          <ExpensesContainer />
          <AddExpensesButton />
          {expenses.isAddExpenseWindowOpen ? <AddExpenseWindow /> : null}
          {expenses.isDeleteExpenseWindow ? <DeleteExpenseWindow /> : null}
        </>
      )}
    </div>
  );
};

export default Home;
