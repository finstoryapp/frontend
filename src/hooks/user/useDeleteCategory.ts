import { deleteCategory } from "@/api/userApi";
import { USER_QUERY_KEY } from "@/app/constants";
import {
  setEditCategoryWindow,
  setIsDeleteCategoryWindow,
} from "@/store/slices/userSlice/userSlice";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<void, Error, string>({
    mutationFn: (categoryName) => deleteCategory(categoryName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEY,
      });
      dispatch(setIsDeleteCategoryWindow(false));
      dispatch(setEditCategoryWindow(false));
    },
  });
}
