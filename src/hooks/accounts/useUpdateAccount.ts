import { updateAccount } from "@/api/accountsApi";
import { ACCOUNTS_QUERY_KEY } from "@/app/constants";
import { setIsEditAccountWindow } from "@/store/slices/accountsSlice/accountsSlice";
import { IUpdateAccount } from "@/types/accountsTypes";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<void, Error, IUpdateAccount>({
    mutationFn: (data) => updateAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ACCOUNTS_QUERY_KEY,
      });
      dispatch(setIsEditAccountWindow(false));
    },
  });
}
