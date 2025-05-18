import { createPortal } from "react-dom";
import styles from "./DeleteAccountWindow.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsDeletingAccountWindow } from "@/store/slices/accountsSlice/accountsSlice";
import { ClipLoader } from "react-spinners";
import { useDeleteAccount } from "@/hooks/accounts/useDeleteAccount";
import { accountsState } from "@/store/slices/accountsSlice/accountsState";
import useKeyPress from "@/hooks/component/useKeyPress";

const DeleteAccountWindow: React.FC = () => {
  const dispatch = useDispatch();
  const { currentAccountId } = useSelector(accountsState);
  const { isPending: isDeletingAccount, mutate: DeleteAccount } =
    useDeleteAccount();

  useKeyPress({
    keys: ["Escape"],
    callback: () => {
      if (!isDeletingAccount) {
        dispatch(setIsDeletingAccountWindow(false));
      }
    },
  });

  return createPortal(
    <div
      className={styles.wrapper}
      onClick={() => {
        dispatch(setIsDeletingAccountWindow(false));
      }}
    >
      {" "}
      <div
        className={styles.window}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h3 className={styles.heading}>Удалить аккаунт?</h3>
        <span className={styles.warning}>Удалятся все связанные расходы.</span>
        <div className={styles.buttons}>
          <button
            className={isDeletingAccount ? styles.disabled : ""}
            onClick={() => dispatch(setIsDeletingAccountWindow(false))}
          >
            Отменить
          </button>
          <button
            onClick={() => {
              DeleteAccount(currentAccountId);
            }}
          >
            {isDeletingAccount ? (
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

export default DeleteAccountWindow;
