import { setCurrency } from "@/api/userApi";
import { USER_QUERY_KEY } from "@/app/constants";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSetCurrency() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (data) => setCurrency(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEY,
      });
    },
  });
}
