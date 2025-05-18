import { createPortal } from "react-dom";
import styles from "./EditCategoryWindow.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditCategoryWindow,
  setIsCustomColorWindow,
  setIsDeleteCategoryWindow,
} from "@/store/slices/userSlice/userSlice";
import useKeyPress from "@/hooks/component/useKeyPress";
import Image from "next/image";
import { useUser } from "@/hooks/user/useUser";
import { useEffect, useState } from "react";
import { DEFAULT_COLORS } from "@/app/constants";
import { userState } from "@/store/slices/userSlice/userSelectors";
import CustomColorWindow from "../CustomColorWindow/CustomColorWindow";
import { useUpdateCategory } from "@/hooks/user/useUpdateCategory";
import { ClipLoader } from "react-spinners";

const EditCategoryWindow: React.FC = () => {
  const dispatch = useDispatch();
  const { data: user } = useUser();
  const [currentColorHex, setCurrentColorHex] = useState(DEFAULT_COLORS[0]);
  const { currentCategoryName, isCustomColorWindow, isDeleteCategoryWindow } =
    useSelector(userState);
  const [currenCategoryNewName, setCurrenCategoryNewName] =
    useState(currentCategoryName);

  const { mutate: updateCategory, isPending: isUpdatingCategory } =
    useUpdateCategory();

  useKeyPress({
    keys: ["Escape"],
    callback: () => {
      if (
        !isUpdatingCategory &&
        !isDeleteCategoryWindow &&
        !isCustomColorWindow
      ) {
        dispatch(setEditCategoryWindow(false));
      }
    },
  });

  useEffect(() => {
    setCurrentColorHex(
      user?.categories.find((category) => category.name === currentCategoryName)
        ?.color!
    );
  }, []);

  return createPortal(
    <div
      className={styles.editCategoryWrapper}
      onClick={() => {
        if (!isUpdatingCategory) {
          dispatch(setEditCategoryWindow(false));
        }
      }}
    >
      <div
        className={styles.editCategory}
        onClick={(event) => event.stopPropagation()}
      >
        {" "}
        <Image
          className={styles.closeButton}
          src={"/icons/close.svg"}
          alt="close"
          width={24}
          height={24}
          onClick={() => {
            if (!isUpdatingCategory) {
              dispatch(setEditCategoryWindow(false));
            }
          }}
        />
        {user?.categories.length !== 1 && (
          <Image
            className={styles.deleteButton}
            src={"/icons/trash.svg"}
            alt="close"
            width={24}
            height={24}
            onClick={() => {
              if (!isUpdatingCategory) {
                dispatch(setIsDeleteCategoryWindow(true));
              }
            }}
          />
        )}
        <h2 className={styles.heading}>Изменить категорию</h2>
        <div className={styles.inputCategoryContainer}>
          <input
            autoFocus
            value={currenCategoryNewName}
            type="text"
            placeholder={String(currenCategoryNewName)}
            className={styles.inputCategory}
            onChange={(e) => setCurrenCategoryNewName(e.target.value)}
            maxLength={20}
            spellCheck="false"
          />
        </div>
        <div className={styles.colors}>
          {DEFAULT_COLORS.map((color) => {
            return (
              <div
                key={color}
                className={`${styles.color} ${
                  color === currentColorHex ? styles.selected : null
                }`}
                style={{ backgroundColor: `#${color}` }}
                onClick={() => {
                  if (!isUpdatingCategory) {
                    setCurrentColorHex(color);
                  }
                }}
              ></div>
            );
          })}{" "}
          <div
            className={`${styles.color} ${
              DEFAULT_COLORS.includes(currentColorHex) ? null : styles.selected
            }`}
            style={{ backgroundColor: `#${currentColorHex}` }}
            onClick={() => {
              if (!isUpdatingCategory) {
                dispatch(setIsCustomColorWindow(true));
              }
            }}
          >
            <img src="/icons/plus.svg" alt="plus" />
          </div>
        </div>
        <button
          className={`${styles.editCategoryButton} ${styles.activeButton}`}
          onClick={() => {
            updateCategory({
              name: currentCategoryName,
              newName: currenCategoryNewName,
              color: currentColorHex,
            });
          }}
        >
          {isUpdatingCategory ? (
            <ClipLoader
              color="var(--text-color)"
              size={"16px"}
              speedMultiplier={1.5}
            />
          ) : (
            <>
              Обновить категорию
              <Image
                src={"/icons/check.svg"}
                alt="check"
                width={24}
                height={24}
              />
            </>
          )}
        </button>
      </div>
      {isCustomColorWindow ? (
        <CustomColorWindow
          currentColorHex={currentColorHex}
          setCurrentColorHex={setCurrentColorHex}
        />
      ) : null}
    </div>,
    document.getElementById("modal-root")!
  );
};

export default EditCategoryWindow;
