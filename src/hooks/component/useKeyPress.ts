import { userState } from "@/store/slices/userSlice/userSelectors";
import { KeyPressType } from "@/types/hookTypes";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const useKeyPress = (args: KeyPressType) => {
  const { keys, callback } = args;
  const { isPremuim } = useSelector(userState);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (keys.includes(event.code)) {
        callback();
      }
    };

    if (isPremuim) {
      document.addEventListener("keyup", handleKeyDown);
    } else {
      document.removeEventListener("keyup", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keyup", handleKeyDown);
    };
  }, [keys, callback, isPremuim]);
};

export default useKeyPress;
