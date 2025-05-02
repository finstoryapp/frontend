"use client";

import styles from "./home.module.css";
import { useSelector, useDispatch } from "react-redux";
import { ExpensesContainer } from "@/components/ExpensesContainer/ExpensesContainer";
import { RotateLoader } from "react-spinners";
import { useEffect } from "react";
import { expensesState } from "@/store/slices/expensesSlice/expensesState";
import ExpensesNavbar from "@/components/ExpensesNavbar/ExpensesNavbar";
import AddExpensesButton from "@/components/AddExpensesButton/AddExpensesButton";
import AddExpenseWindow from "@/components/AddExpenseWindow/AddExpenseWindow";
import { setAddExpenseWindow } from "@/store/slices/expensesSlice/expensesSlice";
import DeleteExpenseWindow from "@/components/DeleteExpenseWindow/DeleteExpenseWindow";
import { useUser } from "@/hooks/user/useUser";
import { useAccounts } from "@/hooks/accounts/useAccounts";
import { useExpenses } from "@/hooks/expenses/useExpenses";
import { setNavbarState } from "@/store/slices/navbarSlice/navbarSlice";

const Home = () => {
  const dispatch = useDispatch();
  const expenses = useSelector(expensesState);
  const { isPending: isUserPending } = useUser();

  const {} = useAccounts({
    enabled: !isUserPending,
  });

  const {} = useExpenses({
    enabled: !isUserPending,
  });

  // Set the current navbar state to home
  useEffect(() => {
    dispatch(setNavbarState({ page: "home" }));
  }, []);

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

  if (isUserPending)
    return (
      <div className={styles.loading}>
        <RotateLoader
          color="var(--text-color-secondary)"
          size={"12px"}
          speedMultiplier={1.5}
        />
      </div>
    );

  return (
    <div className={styles.home}>
      {isUserPending ? (
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
