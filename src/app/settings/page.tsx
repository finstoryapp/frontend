"use client";
import SettingsList from "@/components/SettingsList/SettingsList";
import styles from "./settings.module.css";
import { useSelector } from "react-redux";
import { userState } from "@/store/slices/userSlice/userSelectors";
import CategoriesWindow from "@/components/CategoriesWindow/CategoriesWindow";
import ExportWindow from "@/components/ExportWindow/ExportWindow";
import Subscription from "@/components/Subscription/Subscription";

const Settings = () => {
  const { isCategoriesWindow } = useSelector(userState);
  const { isExportWindow } = useSelector(userState);
  const { isPremuim, isPremiumWindow } = useSelector(userState);

  if (isCategoriesWindow) {
    return (
      <div className={styles.container}>
        <CategoriesWindow />
      </div>
    );
  }

  return (
    <div className={styles.container} onClick={() => console.log(isPremuim)}>
      <SettingsList />
      {isExportWindow ? <ExportWindow /> : null}
      {!isPremuim ? <Subscription /> : null}
      {isPremiumWindow ? <Subscription /> : null}
    </div>
  );
};

export default Settings;
