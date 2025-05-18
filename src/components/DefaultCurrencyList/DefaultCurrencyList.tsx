import { useUser } from "@/hooks/user/useUser";
import { currencies } from "@/app/constants";
import styles from "./DefaultCurrencyList.module.css";
import { ClipLoader } from "react-spinners";
import { useSetCurrency } from "@/hooks/user/useSetCurrency";
import useScrollTabs from "@/hooks/component/useScrollTabs";

const DefaultCurrencyList: React.FC = () => {
  const { data: user, isPending: isUserPending } = useUser();
  const defaultCurrency = user?.defaultCurrency;
  const { ref, events } = useScrollTabs();

  const { mutate: setCurrency, isPending: isCurrencyPending } =
    useSetCurrency();

  if (isUserPending)
    return (
      <div className={`${styles.accountHead} ${styles.loading}`}>
        <ClipLoader size={"16px"} color="var(--text-color)" />
      </div>
    );

  return (
    <div className={styles.accountHead}>
      <div className={styles.accountHeader}>
        <p>Управление счетами</p>
      </div>
      <p className={styles.currencyHeader}>
        <span>Основная валюта - </span>
        <span>{defaultCurrency}</span>
      </p>
      <div className={styles.defaultCurrencyChoice} {...events} ref={ref}>
        {isCurrencyPending ? (
          <div className={`${styles.loadingCurrencies}`}>
            <ClipLoader size={"16px"} color="var(--text-color)" />
          </div>
        ) : (
          [
            defaultCurrency,
            ...currencies.filter((currency) => currency !== defaultCurrency),
          ].map((currency, index) => {
            return (
              <span
                onClick={() => {
                  setCurrency(currency ? currency : "USD");
                }}
                className={`${styles.currencyItem} ${
                  defaultCurrency === currency ? styles.selectedCurrency : ""
                } ${
                  currency === defaultCurrency ? styles.defaultCurrency : ""
                }`}
                key={`${currency}-${index}`}
              >
                {currency}
              </span>
            );
          })
        )}
      </div>
    </div>
  );
};
export default DefaultCurrencyList;
