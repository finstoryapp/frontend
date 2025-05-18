import { useUser } from "@/hooks/user/useUser";
import styles from "./StatisticsPieChart.module.css";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useAccounts } from "@/hooks/accounts/useAccounts";
import { StatisticsPieChartProps } from "@/types/propsTypes";
import useTotalSum from "@/hooks/component/useTotalSum";

const StatisticsPieChart: React.FC<StatisticsPieChartProps> = (props) => {
  const { currentStatistics, statisticsData } = props;
  const { data: user } = useUser();
  const { data: accounts } = useAccounts();

  const totalSum = useTotalSum({ currentStatistics: currentStatistics });

  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statisticsData}
              cx="50%"
              cy="50%"
              activeShape={false}
              //! TECH DEBT -> Change view of the pie chart
              // innerRadius={90}
              // outerRadius={100}
              // label={({ name, value }) => `${value.toFixed(2)}`}
              innerRadius={130}
              outerRadius={150}
              paddingAngle={5}
              dataKey="sum"
              stroke="none"
              fontSize={12}
              animationDuration={100}
            >
              {statisticsData
                .sort((a, b) => b.sum - a.sum)
                .map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`#${entry.color}`}
                    style={{ outline: "none" }}
                  />
                ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.totalSum}>
        <span className={styles.sumLabel}>Расход за месяц:</span>
        <span className={styles.sumValue}>
          {-1 * +totalSum}{" "}
          {currentStatistics === 0
            ? user?.defaultCurrency
            : accounts![currentStatistics - 1].currency}
        </span>
      </div>
    </div>
  );
};

export default StatisticsPieChart;
