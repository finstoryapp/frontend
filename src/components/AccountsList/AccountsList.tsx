import { useAccounts } from "@/hooks/accounts/useAccounts";
import styles from "./AccountsList.module.css";
import NextButtonSvg from "@/svg/NextButtonSvg";
import { useDispatch } from "react-redux";
import {
  setCurrentAccountId,
  setIsEditAccountWindow,
} from "@/store/slices/accountsSlice/accountsSlice";

const AccountsList: React.FC = () => {
  const { data: accounts } = useAccounts();
  const dispatch = useDispatch();

  return (
    <div className={styles.accountsList}>
      {accounts?.map((account) => (
        <div key={account.id} className={styles.accountItem}>
          <div className={styles.accountItemHeader}>
            <p>{account.accountName}</p>
            {accounts.length !== 1 ? (
              <button
                onClick={() => {
                  dispatch(setCurrentAccountId(+account.id));
                  dispatch(setIsEditAccountWindow(true));
                }}
              >
                <NextButtonSvg />
              </button>
            ) : (
              ""
            )}
          </div>
          <p>Валюта: {account.currency}</p>
        </div>
      ))}
    </div>
  );
};

export default AccountsList;
