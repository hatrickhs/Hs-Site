
// import React from "react";
// import ElectricCategoryCart from "./ElectricCategoryCart";
// import { useAppSelector } from "../../State/Store";
// import { HomeCategory } from "../../State/types/HomeCategoryTypes";

// const ElectricCategory = () => {
//   const customer = useAppSelector((state) => state.customer);

//   //  section-wise filter
//   const electricCategories: HomeCategory[] =
//     customer.categories.filter(
//       (item) => item.section === "ELECTRIC_CATEGORIES"
//     );

//   return (
//     <div className="flex flex-wrap justify-between py-5 lg:px-20 border-b">
//       {electricCategories.slice(0, 7).map((item) => (
//         <ElectricCategoryCart key={item.id} item={item} />
//       ))}
//     </div>
//   );
// };

// export default ElectricCategory;


import React from "react";
import ElectricCategoryCart from "./ElectricCategoryCart";
import { useAppSelector } from "../../State/Store";
import { HomeCategory } from "../../State/types/HomeCategoryTypes";

const ElectricCategory = () => {
  const customer = useAppSelector((state) => state.customer);

  const electricCategories: HomeCategory[] =
    customer.categories.filter(
      (item) => item.section === "ELECTRIC_CATEGORIES"
    );

  // duplicate items for seamless loop
  const scrollingItems = [
    ...electricCategories,
    ...electricCategories,
  ];

  return (
    <div className="overflow-hidden border-b py-5 bg-white">
      <div className="scroll-container">
        {scrollingItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="min-w-fit mx-4">
            <ElectricCategoryCart item={item} />
          </div>
        ))}
      </div>

      <style>
        {`
          .scroll-container {
            display: flex;
            width: max-content;
            animation: scrollLeft 25s linear infinite;
          }

          .scroll-container:hover {
            animation-play-state: paused;
          }

          @keyframes scrollLeft {
            0% {
              transform: translateX(0);
            }

            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ElectricCategory;