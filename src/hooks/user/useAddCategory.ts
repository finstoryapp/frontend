import { addCategory } from "@/api/userApi";
import { USER_QUERY_KEY } from "@/app/constants";
import { setAddCategoryWindow } from "@/store/slices/userSlice/userSlice";
import { IAddCategory } from "@/types/userTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export function useAddCategory() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<void, Error, IAddCategory>({
    mutationFn: (data) => addCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEY,
      });
      dispatch(setAddCategoryWindow(false));
    },
  });
}
