
import React from "react";
import ElectricCategoryCart from "./ElectricCategoryCart";
import { useAppSelector } from "../../State/Store";
import { HomeCategory } from "../../State/types/HomeCategoryTypes";

const ElectricCategory = () => {
  const customer = useAppSelector((state) => state.customer);

  //  section-wise filter
  const electricCategories: HomeCategory[] =
    customer.categories.filter(
      (item) => item.section === "ELECTRIC_CATEGORIES"
    );

  return (
    <div className="flex flex-wrap justify-between py-5 lg:px-20 border-b">
      {electricCategories.slice(0, 7).map((item) => (
        <ElectricCategoryCart key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ElectricCategory;

