import { createPortal } from "react-dom";
import styles from "./DeleteCategoryWindow.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsDeleteCategoryWindow } from "@/store/slices/userSlice/userSlice";
import { useDeleteCategory } from "@/hooks/user/useDeleteCategory";
import { userState } from "@/store/slices/userSlice/userSelectors";
import { ClipLoader } from "react-spinners";
import useKeyPress from "@/hooks/component/useKeyPress";

const DeleteCategoryWindow: React.FC = () => {
  const dispatch = useDispatch();
  const { mutate: deleteCategory, isPending: isDeletingCategory } =
    useDeleteCategory();
  const { currentCategoryName } = useSelector(userState);

  useKeyPress({
    keys: ["Escape"],
    callback: () => {
      if (!isDeletingCategory) {
        dispatch(setIsDeleteCategoryWindow(false));
      }
    },
  });

  return createPortal(
    <div
      className={styles.wrapper}
      onClick={() => {
        if (!isDeletingCategory) {
          dispatch(setIsDeleteCategoryWindow(false));
        }
      }}
    >
      <div
        className={styles.window}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h3>Удалить категорию?</h3>
        <span className={styles.warning}>
          Удалятся все связанные расходы.
        </span>{" "}
        <div className={styles.buttons}>
          <button
            className={isDeletingCategory ? styles.disabled : ""}
            onClick={() => dispatch(setIsDeleteCategoryWindow(false))}
          >
            Отменить
          </button>
          <button
            onClick={() => {
              deleteCategory(currentCategoryName);
            }}
          >
            {isDeletingCategory ? (
              <ClipLoader
                color="var(--text-color)"
                size={"12px"}
                speedMultiplier={1.5}
              />
            ) : (
              "Удалить"
            )}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default DeleteCategoryWindow;
