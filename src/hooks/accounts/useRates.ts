import { useQuery } from "@tanstack/react-query";
import { RATES_QUERY_KEY } from "@/app/constants";
import { useAccounts } from "./useAccounts";
import { getRate } from "@/api/ratesApi";
import { IRate } from "@/types/utilsTypes";
import { useUser } from "../user/useUser";

export function useRates(args?: { enabled?: boolean }) {
  const { data: accounts } = useAccounts();
  const { data: user } = useUser();

  return useQuery<IRate[]>({
    queryKey: [RATES_QUERY_KEY, accounts],
    queryFn: async () => {
      if (!accounts) throw new Error("Accounts not loaded");

      const defaultCurrency = user?.defaultCurrency;

      if (!defaultCurrency) throw new Error("Default currency not found");

      const uniqueCurrencies = Array.from(
        new Set(
          accounts
            .map((a) => a.currency)
            .filter((currency) => currency !== defaultCurrency)
        )
      );

      const rates = await Promise.all(
        uniqueCurrencies.map(async (currency) => {
          const res = await getRate({
            fromCurrency: defaultCurrency,
            toCurrency: currency,
          });
          return { currency: res.to, rate: res.rate };
        })
      );

      return rates;
    },
    enabled: (args?.enabled ?? true) && !!accounts,
  });
}
