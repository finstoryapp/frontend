"use client";

import styles from "./home.module.css";
import { useSelector, useDispatch } from "react-redux";
import { ExpensesContainer } from "@/components/ExpensesContainer/ExpensesContainer";
import { RotateLoader } from "react-spinners";
import { useEffect } from "react";
import { expensesState } from "@/store/slices/expensesSlice/expensesState";
import ExpensesNavbar from "@/components/ExpensesNavbar/ExpensesNavbar";
import AddExpenseWindow from "@/components/AddExpenseWindow/AddExpenseWindow";
import { setAddExpenseWindow } from "@/store/slices/expensesSlice/expensesSlice";
import DeleteExpenseWindow from "@/components/DeleteExpenseWindow/DeleteExpenseWindow";
import { useUser } from "@/hooks/user/useUser";
import { useAccounts } from "@/hooks/accounts/useAccounts";
import { useExpenses } from "@/hooks/expenses/useExpenses";
import { setNavbarState } from "@/store/slices/navbarSlice/navbarSlice";
import AddButton from "@/components/AddButton/AddButton";
import useKeyPress from "@/hooks/component/useKeyPress";

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

  useKeyPress({
    keys: ["KeyW"],
    callback: () => dispatch(setAddExpenseWindow(true)),
  });

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
          <AddButton
            text="Добавить расход"
            onClick={() => {
              dispatch(setAddExpenseWindow(true));
            }}
          />
          {expenses.isAddExpenseWindowOpen ? <AddExpenseWindow /> : null}
          {expenses.isDeleteExpenseWindow ? <DeleteExpenseWindow /> : null}
        </>
      )}
    </div>
  );
};

export default Home;
