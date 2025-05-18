import { deleteAccount } from "@/api/accountsApi";
import { ACCOUNTS_QUERY_KEY } from "@/app/constants";
import {
  setIsDeletingAccountWindow,
  setIsEditAccountWindow,
} from "@/store/slices/accountsSlice/accountsSlice";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<void, Error, number>({
    mutationFn: (accountId) => deleteAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ACCOUNTS_QUERY_KEY,
      });
      dispatch(setIsDeletingAccountWindow(false));
      dispatch(setIsEditAccountWindow(false));
    },
  });
}
