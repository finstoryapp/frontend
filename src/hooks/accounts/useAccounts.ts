import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/api/accountsApi";
import { ACCOUNTS_QUERY_KEY } from "@/app/constants";

export function useAccounts(args?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: getAccounts,
    enabled: args?.enabled ?? true,
  });
}
