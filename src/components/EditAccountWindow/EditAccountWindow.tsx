import { createPortal } from "react-dom";
import styles from "./EditAccountWindow.module.css";
import { accountsState } from "@/store/slices/accountsSlice/accountsState";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsDeletingAccountWindow,
  setIsEditAccountWindow,
} from "@/store/slices/accountsSlice/accountsSlice";
import Image from "next/image";
import { useAccounts } from "@/hooks/accounts/useAccounts";
import useScrollTabs from "@/hooks/component/useScrollTabs";
import { currencies } from "@/app/constants";
import { useEffect, useState } from "react";
import { useUpdateAccount } from "@/hooks/accounts/useUpdateAccount";
import { ClipLoader } from "react-spinners";
import useKeyPress from "@/hooks/component/useKeyPress";

const EditAccountWindow: React.FC = () => {
  const dispatch = useDispatch();
  const { currentAccountId, isDeleteAccountWindow } =
    useSelector(accountsState);
  const { data: accounts } = useAccounts();
  const { ref, events } = useScrollTabs();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const currentAccountData = accounts?.find(
    (account) => account.accountId === String(currentAccountId)
  );
  const [accountNameValue, setAccountNameValue] = useState(
    currentAccountData?.accountName ? currentAccountData?.accountName : ""
  );
  const { mutate: updateAccount, isPending: isUpdatingAccount } =
    useUpdateAccount();
  const [currenciesList, setCurrenciesList] = useState([...currencies]);

  useEffect(() => {
    const newCurrenciesList = currenciesList.filter(
      (currency) => currency !== currentAccountData?.currency
    );
    newCurrenciesList.unshift(currentAccountData?.currency!);
    setCurrenciesList(newCurrenciesList);
    setSelectedCurrency(newCurrenciesList[0]);
  }, []);

  useKeyPress({
    keys: ["Escape"],
    callback: () => {
      if (!isUpdatingAccount && !isDeleteAccountWindow) {
        dispatch(setIsEditAccountWindow(false));
      }
    },
  });

  return createPortal(
    <div
      className={styles.editAccountWrapper}
      onClick={() => {
        dispatch(setIsEditAccountWindow(false));
      }}
    >
      <div
        className={styles.editAccount}
        onClick={(event) => event.stopPropagation()}
      >
        {" "}
        <Image
          className={styles.closeButton}
          src={"/icons/close.svg"}
          alt="close"
          width={24}
          height={24}
          onClick={() => {
            dispatch(setIsEditAccountWindow(false));
          }}
        />
        {accounts?.length !== 1 && (
          <Image
            className={styles.deleteButton}
            src={"/icons/trash.svg"}
            alt="close"
            width={24}
            height={24}
            onClick={() => {
              if (!isUpdatingAccount) {
                dispatch(setIsDeletingAccountWindow(true));
              }
            }}
          />
        )}
        <h2 className={styles.heading}>Изменить счет</h2>{" "}
        <div className={styles.currencies}>
          <div className={styles.currenciesContainer} {...events} ref={ref}>
            {currenciesList.map((currency) => (
              <span
                onClick={() => {
                  setSelectedCurrency(currency);
                }}
                className={`${styles.currencyItem} ${
                  selectedCurrency === currency ? styles.clicked : ""
                }`}
                key={currency}
              >
                {currency}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.inputAccountContainer}>
          <input
            autoFocus
            value={accountNameValue ? accountNameValue : ""}
            type="text"
            placeholder={String(accountNameValue)}
            className={styles.inputAccount}
            onChange={(e) => setAccountNameValue(e.target.value)}
            maxLength={20}
          />
        </div>
        <button
          className={`${styles.editAccountButton} ${
            selectedCurrency &&
            accountNameValue &&
            !accounts?.find((account) => {
              if (
                account.accountName === accountNameValue &&
                account.accountName !== currentAccountData?.accountName
              ) {
                return true;
              }
            })
              ? styles.activeButton
              : ""
          }`}
          onClick={() => {
            if (
              selectedCurrency &&
              accountNameValue.length > 0 &&
              !isUpdatingAccount &&
              !accounts?.find((account) => {
                if (
                  account.accountName === accountNameValue &&
                  account.accountName !== currentAccountData?.accountName
                ) {
                  return true;
                }
              })
            ) {
              updateAccount({
                accountName: accountNameValue,
                currency: selectedCurrency,
                accountId: currentAccountId,
              });
            }
          }}
        >
          {isUpdatingAccount ? (
            <ClipLoader
              color="var(--text-color)"
              size={"16px"}
              speedMultiplier={1.5}
            />
          ) : (
            <>
              Добавить счет
              <Image
                src={"/icons/check.svg"}
                alt="check"
                width={24}
                height={24}
              />
            </>
          )}
        </button>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default EditAccountWindow;
