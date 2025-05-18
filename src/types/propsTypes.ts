import { StatisticsDataInterface } from "./hookTypes";

export interface AddButtonProps {
  text: string;
  onClick: () => void;
}
export interface StatisticsNavbarProps {
  onClickPrevAccount: () => void;
  onClickNextAccount: () => void;
  currentStatistics: number;
}
export interface ButtonSvgProps {
  onClick?: () => void;
  style?: {};
}
export interface StatisticsPieChartProps {
  currentStatistics: number;
  statisticsData: StatisticsDataInterface[];
}
export interface CustomColorWindowProps {
  currentColorHex: string;
  setCurrentColorHex: React.Dispatch<React.SetStateAction<string>>;
}
