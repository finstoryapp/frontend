import { useUser } from "@/hooks/user/useUser";
import styles from "./CategoriesWindow.module.css";
import PrevButtonSvg from "@/svg/PrevButtonSvg";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddCategoryWindow,
  setCategoriesWindow,
  setCurrentCategoryName,
  setEditCategoryWindow,
} from "@/store/slices/userSlice/userSlice";
import AddButton from "@/components/AddButton/AddButton";
import AddCategoryWindow from "../AddCategoryWindow/AddCategoryWindow";
import { userState } from "@/store/slices/userSlice/userSelectors";
import useKeyPress from "@/hooks/component/useKeyPress";
import EditCategoryWindow from "../EditCategoryWindow/EditCategoryWindow";
import DeleteCategoryWindow from "../DeleteCategoryWindow/DeleteCategoryWindow";

const CategoriesWindow: React.FC = () => {
  const { data: user } = useUser();
  const dispatch = useDispatch();
  const { isAddCategoryWindow, isEditCategoryWindow, isDeleteCategoryWindow } =
    useSelector(userState);

  useKeyPress({
    keys: ["KeyW"],
    callback: () => {
      dispatch(setAddCategoryWindow(true));
    },
  });

  useKeyPress({
    keys: ["Escape"],
    callback: () => {
      if (!isEditCategoryWindow) {
        dispatch(setCategoriesWindow(false));
      }
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.headingContainer}>
        <PrevButtonSvg
          style={{ cursor: "pointer" }}
          onClick={() => {
            dispatch(setCategoriesWindow(false));
          }}
        />
        <h1 className={styles.heading}>Мои категории</h1>
      </div>
      <div className={styles.list}>
        {user?.categories.map((category) => {
          return (
            <button
              className={styles.category}
              key={category.name}
              onClick={() => {
                dispatch(setCurrentCategoryName(category.name));
                dispatch(setEditCategoryWindow(true));
              }}
            >
              <div
                className={styles.circle}
                style={{ backgroundColor: `#${category.color}` }}
              ></div>
              <p className={styles.categoryName}>{category.name}</p>
            </button>
          );
        })}
      </div>
      <AddButton
        text="Добавить категорию"
        onClick={() => dispatch(setAddCategoryWindow(true))}
      />
      {isAddCategoryWindow ? <AddCategoryWindow /> : null}
      {isEditCategoryWindow ? <EditCategoryWindow /> : null}
      {isDeleteCategoryWindow ? <DeleteCategoryWindow /> : null}
    </div>
  );
};
export default CategoriesWindow;
