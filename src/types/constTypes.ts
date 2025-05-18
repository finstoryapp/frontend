export interface ISetting {
  name: string;
  link?: string;
  isExternal?: boolean;
  function?: () => void;
}
