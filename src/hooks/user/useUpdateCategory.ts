import { updateCategory } from "@/api/userApi";
import { USER_QUERY_KEY } from "@/app/constants";
import { setEditCategoryWindow } from "@/store/slices/userSlice/userSlice";
import { IUpdateCategory } from "@/types/userTypes";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<void, Error, IUpdateCategory>({
    mutationFn: (categoryName) => updateCategory(categoryName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEY,
      });
      dispatch(setEditCategoryWindow(false));
    },
  });
}
