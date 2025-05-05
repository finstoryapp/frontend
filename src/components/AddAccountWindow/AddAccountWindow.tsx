import Image from "next/image";
import styles from "./AddAccountWindow.module.css";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { setIsAddingAccountWindow } from "@/store/slices/accountsSlice/accountsSlice";
import { useAddAccount } from "@/hooks/accounts/useAddAccount";
import { currencies } from "@/app/constants";
import { useAccounts } from "@/hooks/accounts/useAccounts";
import useScrollTabs from "@/hooks/component/useScrollTabs";
import useKeyPress from "@/hooks/component/useKeyPress";

export const AddAccountWindow: React.FC = () => {
  const dispatch = useDispatch();
  const { mutate: addAccount, isPending: isAddingAccount } = useAddAccount();
  const { data: accounts } = useAccounts();
  const [accountNameValue, setAccountNameValue] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const { ref, events } = useScrollTabs();

  useKeyPress({
    keys: ["KeyW", "Escape"],
    callback: () => dispatch(setIsAddingAccountWindow(false)),
  });

  useKeyPress({
    keys: ["Enter"],
    callback: () => {
      if (selectedCurrency && accountNameValue.length > 1) {
        addAccount({
          accountName: accountNameValue,
          currency: selectedCurrency,
        });
      }
    },
  });

  return createPortal(
    <div
      className={styles.addAccountWrapper}
      onClick={() => dispatch(setIsAddingAccountWindow(false))}
    >
      <div
        className={styles.addAccount}
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          className={styles.closeButton}
          src={"/icons/close.svg"}
          alt="close"
          width={24}
          height={24}
          onClick={() => dispatch(setIsAddingAccountWindow(false))}
        />
        <h2 className={styles.heading}>Новый счет</h2>

        <div className={styles.currencies}>
          <div className={styles.currenciesContainer} {...events} ref={ref}>
            {currencies.map((currency) => (
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
            value={accountNameValue === "" ? "" : accountNameValue}
            type="text"
            placeholder={String(accountNameValue)}
            className={styles.inputAccount}
            onChange={(e) => setAccountNameValue(e.target.value)}
            maxLength={20}
          />
        </div>
        <button
          className={`${styles.addAccountButton} ${
            selectedCurrency && accountNameValue ? styles.activeButton : ""
          }`}
          onClick={() => {
            if (
              selectedCurrency &&
              accountNameValue.length > 0 &&
              !isAddingAccount
            ) {
              addAccount({
                accountName: accountNameValue,
                currency: selectedCurrency,
              });
            }
          }}
        >
          {isAddingAccount ? (
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
        <span className={styles.warning}>
          {accounts?.length === 1
            ? "Создавайте как можно меньше счетов. "
            : null}
          {accounts?.length === 1
            ? "Удаление счета приведет к удалению всех его расходов."
            : null}
        </span>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default AddAccountWindow;
