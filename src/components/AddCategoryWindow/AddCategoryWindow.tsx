import { createPortal } from "react-dom";
import styles from "./AddCategoryWindow.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddCategoryWindow,
  setIsCustomColorWindow,
} from "@/store/slices/userSlice/userSlice";
import { useState } from "react";
import Image from "next/image";
import { DEFAULT_COLORS } from "@/app/constants";
import { useAddCategory } from "@/hooks/user/useAddCategory";
import { ClipLoader } from "react-spinners";
import useKeyPress from "@/hooks/component/useKeyPress";
import { userState } from "@/store/slices/userSlice/userSelectors";
import CustomColorWindow from "../CustomColorWindow/CustomColorWindow";
import { useUser } from "@/hooks/user/useUser";

const AddCategoryWindow: React.FC = () => {
  const dispatch = useDispatch();
  const { isPending: isAddCategoryLoading, mutate: addCategory } =
    useAddCategory();
  const { isCustomColorWindow } = useSelector(userState);
  const [categoryName, setCategoryName] = useState("");
  const [currentColorHex, setCurrentColorHex] = useState(DEFAULT_COLORS[0]);
  const { data: user } = useUser();

  useKeyPress({
    keys: ["Escape"],
    callback: () => {
      if (!isAddCategoryLoading && !isCustomColorWindow) {
        dispatch(setAddCategoryWindow(false));
      }
    },
  });

  return createPortal(
    <div
      className={styles.addCategoryWrapper}
      onClick={() => {
        if (!isAddCategoryLoading) {
          dispatch(setAddCategoryWindow(false));
        }
      }}
    >
      <div
        className={styles.addCategory}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {" "}
        <Image
          className={styles.closeButton}
          src={"/icons/close.svg"}
          alt="close"
          width={24}
          height={24}
          onClick={() => {
            if (!isAddCategoryLoading) {
              dispatch(setAddCategoryWindow(false));
            }
          }}
        />
        <h2 className={styles.heading}>Новая категория</h2>{" "}
        <div className={styles.inputCategoryContainer}>
          <input
            autoFocus
            value={categoryName === "" ? "" : categoryName}
            type="text"
            spellCheck="false"
            placeholder={String(categoryName)}
            className={styles.inputCategory}
            onChange={(e) => setCategoryName(e.target.value)}
            maxLength={20}
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
                onClick={() => setCurrentColorHex(color)}
              ></div>
            );
          })}
          <div
            className={`${styles.color} ${
              DEFAULT_COLORS.includes(currentColorHex) ? null : styles.selected
            }`}
            style={{ backgroundColor: `#${currentColorHex}` }}
            onClick={() => {
              dispatch(setIsCustomColorWindow(true));
              console.log(currentColorHex);
            }}
          >
            <img src="/icons/plus.svg" alt="plus" />
          </div>
        </div>
        <button
          className={`${styles.addCategoryButton} ${
            categoryName.length &&
            !user?.categories.find(
              (category) => category.name === categoryName
            ) &&
            styles.activeButton
          }`}
          onClick={() => {
            if (
              categoryName.length &&
              styles.activeButton &&
              !isAddCategoryLoading &&
              !user?.categories.find(
                (category) => category.name === categoryName
              )
            ) {
              addCategory({
                name: categoryName,
                color: currentColorHex,
              });
            }
          }}
        >
          {isAddCategoryLoading ? (
            <ClipLoader
              color="var(--text-color)"
              size={"16px"}
              speedMultiplier={1.5}
            />
          ) : (
            <>
              Добавить категорию
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

export default AddCategoryWindow;
