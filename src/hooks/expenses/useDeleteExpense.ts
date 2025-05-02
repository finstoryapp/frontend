import { deleteExpense } from "@/api/expensesApi";
import { EXPENSES_QUERY_KEY } from "@/app/constants";
import { closeDeleteExpenseWindow } from "@/store/slices/expensesSlice/expensesSlice";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<void, Error, string>({
    mutationFn: (data) => deleteExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EXPENSES_QUERY_KEY,
      });
      dispatch(closeDeleteExpenseWindow());
    },
  });
}
