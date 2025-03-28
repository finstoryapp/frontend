"use client";

import { page } from "@/store/slices/navbarSlice/selectors";
import styles from "./Navbar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import Image from "next/image";
import { setNavbarState } from "@/store/slices/navbarSlice/navbarSlice";
import { Navbar as NavbarInterface } from "@/store/slices/navbarSlice/navbarSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const navbarState = useSelector(page);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleNavigation = (path: string, state: NavbarInterface) => {
    dispatch(setNavbarState(state));
    router.push(path);
  };

  const paths = [
    { path: "/", state: "home", label: "Домашняя", icon: "home" },
    { path: "/accounts", state: "accounts", label: "Счета", icon: "accounts" },
    {
      path: "/statistics",
      state: "statistics",
      label: "Статистика",
      icon: "statistics",
    },
    {
      path: "/settings",
      state: "settings",
      label: "Настройки",
      icon: "settings",
    },
  ];

  return (
    <nav className={styles.navbar}>
      {paths.map(({ path, state, label, icon }) => (
        <Link
          key={state}
          href={path}
          passHref
          onClick={() => {
            handleNavigation(path, { page: state } as NavbarInterface);
          }}
          className={`${navbarState === state ? styles.active : ""}`}
        >
          <Image
            src={`/icons/${icon}${navbarState === state ? "_active" : ""}.svg`}
            alt={label}
            width={24}
            height={24}
            priority={false}
          />
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
