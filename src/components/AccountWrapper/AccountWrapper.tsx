import NextButtonSvg from "@/svg/NextButtonSvg";
import PrevButtonSvg from "@/svg/PrevButtonSvg";
import styles from "./AccountWrapper.module.css";
import { accountState } from "@/store/slices/accountsSlice/accountSelectors";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAccountIndex } from "@/store/slices/accountsSlice/accountsSlice";

const AccountWrapper: React.FC = () => {
  const accounts = useSelector(accountState).accounts;
  const currentAccountIndex = useSelector(accountState).currentAccountIndex;
  const dispatch = useDispatch();

  return (
    <div className={styles.accountWrapper}>
      {accounts?.length === 0 ? (
        <span className={styles.accountNoAccount}>
          За этот месяц записей нет.
        </span>
      ) : (
        accounts &&
        accounts.length > 0 && (
          <>
            {accounts.length > 1 && (
              <button
                style={
                  currentAccountIndex === 0 ? { visibility: "hidden" } : {}
                }
                disabled={currentAccountIndex === 0}
                onClick={() => {
                  if (currentAccountIndex > 0) {
                    dispatch(setCurrentAccountIndex(currentAccountIndex - 1));
                  }
                }}
              >
                <PrevButtonSvg />
              </button>
            )}
            <div className={styles.accountWrapperBox}>
              <p className={styles.accountWrapperBoxName}>
                {accounts[currentAccountIndex]?.accountName}
              </p>
              <p className={styles.accountWrapperBoxValue}>
                {-1 * 0} <span>{accounts[currentAccountIndex]?.currency}</span>
              </p>
            </div>
            {accounts.length > 1 && (
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
            )}
          </>
        )
      )}
    </div>
  );
};

export default AccountWrapper;
