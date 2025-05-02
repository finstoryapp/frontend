import { useQuery } from "@tanstack/react-query";
import { EXPENSES_QUERY_KEY } from "@/app/constants";
import { getExpenses } from "@/api/expensesApi";
import { getUnixMonthStartEnd } from "@/utils/getUnixMonthStartEnd";
import { useSelector } from "react-redux";
import { expensesNavbarState } from "@/store/slices/expensesNavbarSlice/expensesNavbarState";

export function useExpenses(args?: { enabled?: boolean }) {
  const expensesNavbar = useSelector(expensesNavbarState);

  const monthUnixStartEnd = getUnixMonthStartEnd(
    expensesNavbar.year,
    expensesNavbar.month
  );

  return useQuery({
    queryKey: [...EXPENSES_QUERY_KEY, expensesNavbar.month],
    queryFn: () => {
      return getExpenses(monthUnixStartEnd.start, monthUnixStartEnd.end);
    },
    enabled: args?.enabled ?? true,
  });
}
