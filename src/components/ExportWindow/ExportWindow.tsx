import { createPortal } from "react-dom";
import styles from "./ExportWindow.module.css";
import { useDispatch } from "react-redux";
import { setIsExportWindow } from "@/store/slices/userSlice/userSlice";
import { getExcel } from "@/api/userApi";
import { useEffect } from "react";
import useKeyPress from "@/hooks/component/useKeyPress";

const ExportWindow: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getExcel();
  }, []);

  useKeyPress({
    keys: ["Escape"],
    callback: () => {
      dispatch(setIsExportWindow(false));
    },
  });

  return createPortal(
    <div
      className={styles.wrapper}
      onClick={() => {
        dispatch(setIsExportWindow(false));
      }}
    >
      <div
        className={styles.window}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <p>Данные выгружены в бота</p>
        <a href="https://t.me/finstorybot">@Finstorybot</a>
        <button
          className={styles.button}
          onClick={() => {
            dispatch(setIsExportWindow(false));
          }}
        >
          Готово
        </button>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default ExportWindow;
