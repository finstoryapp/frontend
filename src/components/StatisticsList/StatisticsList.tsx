import useStatisticsData from "@/hooks/component/useStatisticsData";
import styles from "./StatisticsList.module.css";
import { StatisticsDataType } from "@/types/hookTypes";
import useTotalSum from "@/hooks/component/useTotalSum";

const StatisticsList: React.FC<StatisticsDataType> = (args) => {
  const { currentStatistics } = args;

  const statisticsData = useStatisticsData({
    currentStatistics: currentStatistics,
  });
  const totalSum = useTotalSum({ currentStatistics: currentStatistics });

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {statisticsData
          .sort((a, b) => b.sum - a.sum)
          .map((stat, index) => {
            return (
              <div key={(stat.category, index)} className={styles.category}>
                <div className={styles.heading}>
                  <div
                    style={{ backgroundColor: `#${stat.color}` }}
                    className={styles.circle}
                  ></div>
                  <p> {stat.category}</p>
                </div>
                <p>
                  <span> {+stat.sum.toFixed(2)}</span>
                  <span className={styles.dot}></span>
                  <span className={styles.percentage}>
                    {Number(
                      (+stat.sum.toFixed(2) / (+totalSum / 100)).toFixed(2)
                    )}
                    {"%"}
                  </span>
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default StatisticsList;
