export interface KeyPressType {
  keys: string[];
  callback: () => void;
}
export interface StatisticsDataInterface {
  category: string;
  color: string;
  sum: number;
}
export interface StatisticsDataType {
  currentStatistics: number;
}
export interface TotalSumType {
  currentStatistics: number;
}
