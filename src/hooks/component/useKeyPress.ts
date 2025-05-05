import { useEffect } from "react";

interface keyPressType {
  keys: string[];
  callback: () => void;
}

const useKeyPress = (args: keyPressType) => {
  const { keys, callback } = args;
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (keys.includes(event.code)) {
        callback();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [keys, callback]);
};

export default useKeyPress;
