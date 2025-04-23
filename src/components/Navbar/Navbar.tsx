"use client";

import { page } from "@/store/slices/navbarSlice/navbarSelectors";
import styles from "./Navbar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import Image from "next/image";
import { setNavbarState } from "@/store/slices/navbarSlice/navbarSlice";
import { Navbar as NavbarInterface } from "@/types/navbarTypes";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { paths } from "./const";

const Navbar: React.FC = () => {
  const navbarState = useSelector(page);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleNavigation = (path: string, state: NavbarInterface) => {
    dispatch(setNavbarState(state));
    router.push(path);
  };

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
