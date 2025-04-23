import NextButtonSvg from "@/svg/NextButtonSvg";
import PrevButtonSvg from "@/svg/PrevButtonSvg";
import styles from "./AccountWrapper.module.css";
import { accountState } from "@/store/slices/accountsSlice/accountSelectors";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAccountIndex } from "@/store/slices/accountsSlice/accountsSlice";
import { useEffect } from "react";
import { getFullMonthAccountSum } from "@/utils/getFullMonthAccountSum";

const AccountWrapper: React.FC = () => {
  const { accounts, currentAccountIndex } = useSelector(accountState);
  const dispatch = useDispatch();

  // Change accounts by A and D keys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyA") {
        if (currentAccountIndex > 0) {
          dispatch(setCurrentAccountIndex(currentAccountIndex - 1));
        }
      } else if (event.code === "KeyD") {
        if (accounts && currentAccountIndex < accounts.length - 1) {
          dispatch(setCurrentAccountIndex(currentAccountIndex + 1));
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accounts, currentAccountIndex]);

  return (
    <div className={styles.accountWrapper}>
      {!accounts?.length && (
        <span className={styles.accountNoAccount}>Аккаунтов нет.</span>
      )}

      {!!accounts?.length && (
        <>
          <button
            style={currentAccountIndex === 0 ? { visibility: "hidden" } : {}}
            disabled={currentAccountIndex === 0}
            onClick={() => {
              if (currentAccountIndex > 0) {
                dispatch(setCurrentAccountIndex(currentAccountIndex - 1));
              }
            }}
          >
            <PrevButtonSvg />
          </button>

          <div className={styles.accountWrapperBox}>
            <p className={styles.accountWrapperBoxName}>
              {accounts[currentAccountIndex]?.accountName}
            </p>
            <p className={styles.accountWrapperBoxValue}>
              {parseFloat(
                (
                  -1 *
                  getFullMonthAccountSum({
                    accountId: Number(accounts![currentAccountIndex].accountId),
                  })
                ).toFixed(2)
              )}
              <span> {accounts[currentAccountIndex]?.currency}</span>
            </p>
          </div>

          <button
            style={
              currentAccountIndex === accounts.length - 1
                ? { visibility: "hidden" }
                : {}
            }
            onClick={() => {
              if (accounts && currentAccountIndex < accounts.length - 1) {
                dispatch(setCurrentAccountIndex(currentAccountIndex + 1));
              }
            }}
            disabled={currentAccountIndex === accounts.length - 1}
          >
            <NextButtonSvg />
          </button>
        </>
      )}
    </div>
  );
};

export default AccountWrapper;
