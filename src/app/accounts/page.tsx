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
import useKeyPress from "@/hooks/component/useKeyPress";
import EditAccountWindow from "@/components/EditAccountWindow/EditAccountWindow";
import Subscription from "@/components/Subscription/Subscription";
import { userState } from "@/store/slices/userSlice/userSelectors";

const Accounts = () => {
  const { isDeleteAccountWindow } = useSelector(accountsState);
  const { isAddingAccountWindow } = useSelector(accountsState);
  const { isEditAccountWindow } = useSelector(accountsState);
  const dispatch = useDispatch();
  const { isPremuim } = useSelector(userState);

  useKeyPress({
    keys: ["KeyW"],
    callback: () => {
      dispatch(setIsAddingAccountWindow(true));
    },
  });

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
      {isAddingAccountWindow ? <AddAccountWindow /> : null}
      {isEditAccountWindow ? <EditAccountWindow /> : null}
      {isDeleteAccountWindow ? <DeleteAccountWindow /> : null}
      {!isPremuim ? <Subscription /> : null}
    </div>
  );
};

export default Accounts;
