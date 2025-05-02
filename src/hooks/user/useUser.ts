import { useQuery } from "@tanstack/react-query";
import { authUser } from "@/api/userApi";
import { USER_QUERY_KEY } from "@/app/constants";

export function useUser() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: authUser,
  });
}
