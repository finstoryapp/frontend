import { TotalSumType } from "@/types/hookTypes";
import { useEffect, useState } from "react";
import { useRates } from "../accounts/useRates";
import { getFullMonthExpensesSum } from "@/utils/getFullMonthExpensesSum";
import { getFullMonthAccountSum } from "@/utils/getFullMonthAccountSum";
import { useExpenses } from "../expenses/useExpenses";
import { useAccounts } from "../accounts/useAccounts";
import { useUser } from "../user/useUser";

const useTotalSum = (args: TotalSumType): string => {
  const { currentStatistics } = args;
  const [totalSum, setTotalSum] = useState("0");
  const { data: rates, refetch: refetchRates } = useRates();
  const { data: user } = useUser();

  const { data: accounts } = useAccounts();
  const { data: expenses } = useExpenses();
  useEffect(() => {
    refetchRates();
    if (currentStatistics === 0) {
      setTotalSum(
        getFullMonthExpensesSum({
          accounts: accounts!,
          expenses: expenses!,
          rates: rates!,
          defaultCurrency: user?.defaultCurrency!,
        }).toFixed(2)
      );
    } else {
      setTotalSum(
        String(
          getFullMonthAccountSum({
            accountId: Number(accounts![currentStatistics - 1].accountId),
            expenses: expenses!,
          })
        )
      );
    }
  }, [rates, user, expenses, currentStatistics]);
  return totalSum;
};

export default useTotalSum;
