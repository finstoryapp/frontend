"use client";
import StatisticsNavbar from "@/components/StatisticsNavbar/StatisticsNavbar";
import styles from "./statistics.module.css";
import { useState } from "react";
import { useAccounts } from "@/hooks/accounts/useAccounts";
import StatisticsPieChart from "@/components/StatisticsPieChart/StatisticsPieChart";
import useStatisticsData from "@/hooks/component/useStatisticsData";
import StatisticsList from "@/components/StatisticsList/StatisticsList";
import Subscription from "@/components/Subscription/Subscription";
import { useSelector } from "react-redux";
import { userState } from "@/store/slices/userSlice/userSelectors";

const Statistics = () => {
  const [currentStatistics, setSurrentStatistics] = useState(0);
  const { data: accounts } = useAccounts();
  const { isPremuim } = useSelector(userState);

  const statisticsData = useStatisticsData({
    currentStatistics: currentStatistics,
  });

  return (
    <div className={styles.container}>
      <StatisticsNavbar
        onClickNextAccount={() =>
          setSurrentStatistics((prevValue) => {
            if (!accounts) {
              return prevValue;
            }
            if (prevValue === accounts.length) {
              return 0;
            } else if (prevValue < accounts.length) {
              return prevValue + 1;
            } else {
              return prevValue;
            }
          })
        }
        onClickPrevAccount={() =>
          setSurrentStatistics((prevValue) => {
            if (!accounts) {
              return prevValue;
            }

            if (prevValue === 0) {
              return accounts.length;
            } else if (prevValue === accounts.length + 1) {
              return accounts.length - 1;
            } else if (
              prevValue === accounts.length ||
              prevValue < accounts.length
            ) {
              return prevValue - 1;
            }
            return 0;
          })
        }
        currentStatistics={currentStatistics}
      />
      <StatisticsPieChart
        currentStatistics={currentStatistics}
        statisticsData={statisticsData}
      />
      <StatisticsList currentStatistics={currentStatistics} />
      {!isPremuim ? <Subscription /> : null}
    </div>
  );
};

export default Statistics;
