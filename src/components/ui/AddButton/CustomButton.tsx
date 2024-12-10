import { useRef } from "react";
import styles from "./CustomButton.module.css";
import Image from "next/image";

interface CustomButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  borderRadius?: string;
  iconPath?: string;
  backgroundColor?: string;
  height?: string;
  width?: string;
  iconWidth?: number;
  iconHeight?: number;
}

export const CustomButton = ({
  children,
  onClick,
  borderRadius,
  iconPath,
  backgroundColor,
  height,
  width,
  iconWidth = 24,
  iconHeight = 24,
}: CustomButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;

    circle.classList.add(styles.ripple);

    // Remove existing ripples
    const ripples = button.getElementsByClassName(styles.ripple);
    for (const ripple of Array.from(ripples)) {
      ripple.remove();
    }

    button.appendChild(circle);

    // Clean up the ripple element
    circle.addEventListener("animationend", () => {
      circle.remove();
    });

    // Call the original onClick handler
    onClick();
  };

  const buttonStyle = {
    borderRadius: borderRadius || "20px",
    backgroundColor: backgroundColor || "#3582ff",
    height: height || "56px",
    width: width || "288px",
  };

  return (
    <button
      ref={buttonRef}
      className={styles.addButton}
      onClick={createRipple}
      style={buttonStyle}
    >
      {children}
      {iconPath ? (
        <Image
          src={iconPath}
          alt="Button icon"
          width={iconWidth}
          height={iconHeight}
          priority={false}
        />
      ) : (
        <Image
          src="/icons/plus.svg"
          alt="Plus icon"
          width={iconWidth}
          height={iconHeight}
          priority={false}
        />
      )}
    </button>
  );
};
