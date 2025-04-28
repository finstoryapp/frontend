// Returns the full month sum (in the default currency)
import { getRate } from "@/api/currenciesApi";
import { accountState } from "@/store/slices/accountsSlice/accountSelectors";

import { userState } from "@/store/slices/userSlice/userSelectors";
import { useSelector } from "react-redux";
import { getFullMonthAccountSum } from "./getFullMonthAccountSum";

//!TODO -> Complete this function
export function getFullMonthExpensesSum(): number {
  const defaultCurrency =
    useSelector(userState).userData?.defaultCurrency ?? "USD";

  // Array of objects [{id: string, currency: string}, ...]
  const accountsData = useSelector(accountState).accounts?.map((account) => {
    return { id: account.accountId, currency: account.currency };
  });

  // [{sum: number, currency: string}, ...]
  const accountsSum = accountsData?.map((account) => {
    return {
      sum: getFullMonthAccountSum({ accountId: Number(account.id) }),
      currency: account.currency,
    };
  });

  // Calculate the total sum
  const total = accountsSum?.reduce((total, currentAccountSum) => {
    if (defaultCurrency === currentAccountSum.currency) {
      return (total += currentAccountSum.sum);
    } else {
      const rate = getRate({
        fromCurrency: defaultCurrency,
        toCurrency: currentAccountSum.currency,
      });
      return total + currentAccountSum.sum;
    }
  }, 0);
  return total ? total : 0;
}
