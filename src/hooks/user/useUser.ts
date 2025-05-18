import { useQuery } from "@tanstack/react-query";
import { authUser } from "@/api/userApi";
import { USER_QUERY_KEY } from "@/app/constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { isPremiumValid } from "@/utils/isPremiumValid";
import { setIsPremuim } from "@/store/slices/userSlice/userSlice";

export function useUser() {
  const dispatch = useDispatch();

  const queryResult = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: authUser,
  });

  useEffect(() => {
    if (queryResult.isSuccess) {
      if (queryResult.data.premiumUntil === null) {
        dispatch(setIsPremuim(false));
      } else {
        if (isPremiumValid(+queryResult.data.premiumUntil)) {
          dispatch(setIsPremuim(true));
        } else {
          dispatch(setIsPremuim(false));
        }
      }
    }
  }, [queryResult.isSuccess, queryResult.data]);

  return queryResult;
}
