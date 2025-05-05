import NextButtonSvg from "@/svg/NextButtonSvg";
import PrevButtonSvg from "@/svg/PrevButtonSvg";
import styles from "./AccountWrapper.module.css";
import { accountsState } from "@/store/slices/accountsSlice/accountsState";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAccountIndex } from "@/store/slices/accountsSlice/accountsSlice";
import { getFullMonthAccountSum } from "@/utils/getFullMonthAccountSum";
import { useAccounts } from "@/hooks/accounts/useAccounts";
import { useExpenses } from "@/hooks/expenses/useExpenses";
import useKeyPress from "@/hooks/component/useKeyPress";

const AccountWrapper: React.FC = () => {
  const { data: accounts } = useAccounts();
  const { data: expenses } = useExpenses();
  const { currentAccountIndex } = useSelector(accountsState);
  const dispatch = useDispatch();

  useKeyPress({
    keys: ["KeyA"],
    callback: () => {
      if (currentAccountIndex > 0) {
        dispatch(setCurrentAccountIndex(currentAccountIndex - 1));
      }
    },
  });
  useKeyPress({
    keys: ["KeyD"],
    callback: () => {
      if (accounts && currentAccountIndex < accounts.length - 1) {
        dispatch(setCurrentAccountIndex(currentAccountIndex + 1));
      }
    },
  });

  if (!accounts?.length)
    return (
      <div className={styles.accountWrapper}>
        <span className={styles.accountNoAccount}>Загрузка аккаунтов...</span>
      </div>
    );

  if (!!accounts?.length)
    return (
      <div className={styles.accountWrapper}>
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
                  expenses: expenses!,
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
      </div>
    );
};

export default AccountWrapper;
