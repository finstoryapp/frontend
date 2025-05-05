"use client";

import styles from "./accounts.module.css";
import DefaultCurrencyList from "@/components/DefaultCurrencyList/DefaultCurrencyList";
import AccountsList from "@/components/AccountsList/AccountsList";
import { useDispatch, useSelector } from "react-redux";
import { accountsState } from "@/store/slices/accountsSlice/accountsState";
import DeleteAccountWindow from "@/components/DeleteAccountWindow/DeleteAccountWindow";
import AddAccountWindow from "@/components/AddAccountWindow/AddAccountWindow";
import AddButton from "@/components/AddButton/AddButton";
import { setIsAddingAccountWindow } from "@/store/slices/accountsSlice/accountsSlice";

const Accounts = () => {
  const { isDeleteAccountWindow } = useSelector(accountsState);
  const { isAddingAccountWindow } = useSelector(accountsState);
  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      <DefaultCurrencyList />
      <AccountsList />
      <AddButton
        text="Добавить счет"
        onClick={() => {
          dispatch(setIsAddingAccountWindow(true));
        }}
      />
      {isDeleteAccountWindow ? <DeleteAccountWindow /> : null}
      {isAddingAccountWindow ? <AddAccountWindow /> : null}
    </div>
  );
};

export default Accounts;
