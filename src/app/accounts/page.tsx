"use client";
import { CustomButton } from "@/components/ui/AddButton/CustomButton";

export default function Accounts() {
  const handleAddClick = () => {
    console.log("Add button clicked");
  };

  return (
    <div className="text-sm">
      <CustomButton onClick={handleAddClick}>Добавить счёт</CustomButton>
    </div>
  );
}
