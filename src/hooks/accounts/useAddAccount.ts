import { addAccount } from "@/api/accountsApi";
import { ACCOUNTS_QUERY_KEY } from "@/app/constants";
import { setIsAddingAccountWindow } from "@/store/slices/accountsSlice/accountsSlice";
import { IAddAccount } from "@/types/accountsTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export function useAddAccount() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<void, Error, IAddAccount>({
    mutationFn: (data) => addAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ACCOUNTS_QUERY_KEY,
      });
      dispatch(setIsAddingAccountWindow(false));
    },
  });
}
