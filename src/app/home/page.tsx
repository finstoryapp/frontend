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
import ExpensesNavbar from "@/components/ExpensesNavbar/ExpensesNavbar";
import { fetchExpenses } from "@/store/slices/expensesSlice/expensesThunks";

const Home = () => {
  const user = useSelector(userState);
  const accounts = useSelector(accountState);
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
        </>
      )}
    </div>
  );
};

export default Home;
