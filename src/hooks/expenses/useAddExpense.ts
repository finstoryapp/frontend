import { addExpense } from "@/api/expensesApi";
import { EXPENSES_QUERY_KEY } from "@/app/constants";
import { setAddExpenseWindow } from "@/store/slices/expensesSlice/expensesSlice";
import { IAddExpense, IExpense } from "@/types/expensesTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export function useAddExpense() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<IExpense, Error, IAddExpense>({
    mutationFn: (data) => addExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EXPENSES_QUERY_KEY,
      });
      dispatch(setAddExpenseWindow(false));
    },
  });
}
