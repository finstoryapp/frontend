"use client";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { useEffect } from "react";
import { fetchUtil } from "../utils/utilFetch";
import { Spinner } from "@nextui-org/react";

import { Button } from "@nextui-org/button";
import Image from "next/image";

import styles from "./main.module.css";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { RootState } from "@/store/store";

export default function Me() {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    async function initializeUser() {
      try {
        const { initDataRaw } = retrieveLaunchParams();

        await fetchUtil("auth/login", {
          method: "POST",
          body: JSON.stringify({ initData: initDataRaw }),
        });

        const userData = await fetchUtil("api/me", {
          method: "GET",
        });
        dispatch(setUser(userData));
      } catch (err) {
        console.log(err instanceof Error ? err.message : "An error occurred");
      }
    }

    initializeUser();
  }, []);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.month}>
          <button className={styles.prevMonthBtn}>
            {" "}
            <svg
              width="10"
              height="18"
              viewBox="0 0 10 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.75 1.5L1.25 9L8.75 16.5"
                stroke="#3E9FFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <p className={styles.date}>Октябрь 2024</p>
          <button
            className={styles.prevMonthBtn}
            style={{ visibility: "hidden" }}
          >
            {" "}
            <svg
              width="10"
              height="18"
              viewBox="0 0 10 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.75 1.5L1.25 9L8.75 16.5"
                stroke="#3E9FFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className={styles.sum}>
          <p className={styles.sumText}>Все счета за месяц</p>
          <p className={styles.sumValue}>
            -3650 <span className={styles.sumCurrency}>USD</span>
          </p>
        </div>
      </div>
      <div className={styles.container}>
        {loading ? (
          <div className={styles.loading}>
            <Spinner />
          </div>
        ) : (
          <div className={styles.accountWrapper}>
            <button
              className={styles.accountWrapperLeftBtn}
              style={{ visibility: "hidden" }}
            >
              {" "}
              <svg
                width="10"
                height="18"
                viewBox="0 0 10 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.75 1.5L1.25 9L8.75 16.5"
                  stroke="#3E9FFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className={styles.accountWrapperBox}>
              <p className={styles.accountWrapperBoxName}>MyBank</p>
              <p className={styles.accountWrapperBoxValue}>
                -1275 <span>USD</span>
              </p>
            </div>
            <button className={styles.accountWrapperRightBtn}>
              {" "}
              <svg
                width="10"
                height="18"
                viewBox="0 0 10 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.75 1.5L1.25 9L8.75 16.5"
                  stroke="#3E9FFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className={styles.addButton}>
        <Button
          color="primary"
          onPress={() => {
            console.log(userData);
          }}
          className={styles.addButtonStyled}
          endContent={
            <Image src="/icons/plus.svg" alt="plus" width={24} height={24} />
          }
        >
          Добавить расход
        </Button>
      </div>
    </>
  );
}
