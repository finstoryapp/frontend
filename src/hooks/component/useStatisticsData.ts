import { StatisticsDataInterface, StatisticsDataType } from "@/types/hookTypes";
import { useEffect, useState } from "react";
import { useUser } from "../user/useUser";
import { useAccounts } from "../accounts/useAccounts";
import { useRates } from "../accounts/useRates";
import { useExpenses } from "../expenses/useExpenses";

const useStatisticsData = (
  args: StatisticsDataType
): StatisticsDataInterface[] => {
  const { currentStatistics } = args;
  const [statisticsData, setStatisticsData] = useState<
    StatisticsDataInterface[]
  >([]);

  const { data: user } = useUser();
  const { data: accounts } = useAccounts();
  const { data: rates } = useRates();
  const { data: expenses } = useExpenses();

  useEffect(() => {
    setStatisticsData(() => {
      const arrayOfCategories: string[] = [];
      expenses?.forEach((element) => {
        if (currentStatistics === 0) {
          arrayOfCategories.push(element.categoryName);
        } else {
          if (accounts![currentStatistics - 1].accountId === element.accountId)
            arrayOfCategories.push(element.categoryName);
        }
      });

      const arrayOfUnicCategories = [...new Set(arrayOfCategories)];

      const arrayWithColors = arrayOfUnicCategories
        ?.map((category) => {
          const matchingCategory = user?.categories?.filter(
            (categoryUser) => categoryUser.name === category
          )[0];
          if (!matchingCategory?.color) return null; // Skip if no color
          return {
            category: category,
            color: matchingCategory.color,
          };
        })
        .filter(
          (item): item is { category: string; color: string } => item !== null
        );

      const arrayWithSums: StatisticsDataInterface[] = arrayWithColors
        ?.map((item) => {
          // case 1: it's just an account (1 currency)
          if (currentStatistics !== 0) {
            const sumOfAccount = expenses?.reduce((acc, expense) => {
              if (
                expense.categoryName === item.category &&
                expense.accountId === accounts![currentStatistics - 1].accountId
              ) {
                return acc + +expense.amount;
              }
              return acc;
            }, 0);
            return {
              category: item.category!,
              color: item.color!,
              sum: sumOfAccount!,
            };
          } else {
            // Sum for this category for the entire month
            const sumOfMonth = expenses?.reduce((acc, expense) => {
              if (expense.categoryName === item.category) {
                // Current account
                const accountCurrency = accounts?.find(
                  (account) => account.accountId === expense.accountId
                )?.currency;

                if (user?.defaultCurrency === accountCurrency) {
                  return acc + +expense.amount;
                } else {
                  return (
                    acc +
                    +expense.amount /
                      rates?.find((rate) => rate.currency === accountCurrency)
                        ?.rate!
                  );
                }
              }
              return acc;
            }, 0);
            return {
              category: item.category!,
              color: item.color!,
              sum: sumOfMonth!,
            };
          }
        })
        .filter((item): item is StatisticsDataInterface => item !== undefined);
      return arrayWithSums;
    });
  }, [user, accounts, rates, expenses, currentStatistics]);
  console.log(statisticsData);

  return statisticsData;
};
export default useStatisticsData;
