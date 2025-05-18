import { createPortal } from "react-dom";
import styles from "./CustomColorWindow.module.css";
import { HexColorPicker } from "react-colorful";
import { useDispatch, useSelector } from "react-redux";
import { setIsCustomColorWindow } from "@/store/slices/userSlice/userSlice";
import { CustomColorWindowProps } from "@/types/propsTypes";
import Image from "next/image";
import useKeyPress from "@/hooks/component/useKeyPress";
import { userState } from "@/store/slices/userSlice/userSelectors";

const CustomColorWindow: React.FC<CustomColorWindowProps> = (
  props: CustomColorWindowProps
) => {
  const dispatch = useDispatch();
  const { currentColorHex, setCurrentColorHex } = props;
  const { isAddCategoryWindow, isEditCategoryWindow } = useSelector(userState);

  useKeyPress({
    keys: ["Escape"],
    callback: () => {
      if (isAddCategoryWindow || isEditCategoryWindow) {
        dispatch(setIsCustomColorWindow(false));
      }
    },
  });

  return createPortal(
    <div
      className={styles.customColorWrapper}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.container}>
        <div className={styles.heading}>
          <p>Выберите цвет</p>
          <button
            className={styles.close}
            onClick={() => dispatch(setIsCustomColorWindow(false))}
          >
            <img src="/icons/close.svg" alt="close" />
          </button>
        </div>
        <HexColorPicker
          onChange={(color) => {
            setCurrentColorHex(color.slice(1));
          }}
          color={currentColorHex}
        />
        <button
          className={styles.setColorButton}
          onClick={() => {
            dispatch(setIsCustomColorWindow(false));
          }}
        >
          Установить
          <Image src={"/icons/check.svg"} alt="check" width={24} height={24} />
        </button>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default CustomColorWindow;
