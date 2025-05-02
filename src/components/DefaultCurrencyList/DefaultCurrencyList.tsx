import { useUser } from "@/hooks/user/useUser";
import { currencies } from "@/app/constants";
import styles from "./DefaultCurrencyList.module.css";
import { useRef } from "react";
import { ClipLoader } from "react-spinners";
import { useSetCurrency } from "@/hooks/user/useSetCurrency";

export const DefaultCurrencyList: React.FC = () => {
  const { data: user, isPending: isUserPending } = useUser();
  const defaultCurrency = user?.defaultCurrency;

  const { mutate: setCurrency, isPending: isCurrencyPending } =
    useSetCurrency();

  // All of functions below are for the scrolling
  const currenciesContainerRefDefault = useRef<HTMLDivElement | null>(null);
  const isDraggingDefault = useRef<boolean>(false);
  const startXDefault = useRef<number>(0);
  const scrollLeftDefault = useRef<number>(0);

  const handleMouseDownDefault = (e: React.MouseEvent) => {
    if (currenciesContainerRefDefault.current) {
      isDraggingDefault.current = true;
      startXDefault.current = e.clientX;
      scrollLeftDefault.current =
        currenciesContainerRefDefault.current.scrollLeft;
    }
  };
  const handleMouseMoveDefault = (e: React.MouseEvent) => {
    if (!isDraggingDefault.current || !currenciesContainerRefDefault.current)
      return;
    const x = e.clientX;
    const walk = (x - startXDefault.current) * 1;
    currenciesContainerRefDefault.current.scrollLeft =
      scrollLeftDefault.current - walk;
  };
  const handleMouseUpDefault = () => {
    isDraggingDefault.current = false;
  };
  const handleMouseLeaveDefault = () => {
    isDraggingDefault.current = false;
  };
  const handleWheelDefault = (e: React.WheelEvent) => {
    const container = currenciesContainerRefDefault.current;
    if (!container) return;

    const delta = e.deltaY;
    const atStart = container.scrollLeft === 0;
    const atEnd =
      container.scrollLeft + container.clientWidth >= container.scrollWidth;

    if (!(atStart && delta < 0) && !(atEnd && delta > 0)) {
      e.preventDefault();
      container.scrollLeft += delta;
    }
  };

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
      <div
        className={styles.defaultCurrencyChoice}
        ref={currenciesContainerRefDefault}
        onMouseDown={handleMouseDownDefault}
        onMouseMove={handleMouseMoveDefault}
        onMouseUp={handleMouseUpDefault}
        onMouseLeave={handleMouseLeaveDefault}
        onWheel={handleWheelDefault}
      >
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
