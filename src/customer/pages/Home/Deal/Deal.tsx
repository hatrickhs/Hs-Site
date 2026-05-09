
import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../../State/Store";
import DealCard from "./DealCard";
import { HomeCategory } from "../../../../State/types/HomeCategoryTypes";

const Deal = () => {
  const customer = useAppSelector((state) => state.customer);

  const [loopDeal, setLoopDeal] = useState<HomeCategory[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!customer.categories) return;

    const dealCategories = customer.categories.filter(
      (item) => item.section === "DEALS"
    );

    setLoopDeal([...dealCategories, ...dealCategories]);
  }, [customer.categories]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const speed = 1;
    const intervalTime = 20;

    const scrollInterval = setInterval(() => {
      scrollPosition += speed;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) scrollPosition = 0;

      scrollContainer.scrollTo({ left: scrollPosition, behavior: "auto" });
    }, intervalTime);

    return () => clearInterval(scrollInterval);
  }, [loopDeal]);

  if (!loopDeal || loopDeal.length === 0) return <p>No deals available</p>;

  return (
    <div className="py-5 lg:px-20">

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden whitespace-nowrap"
      >
        {loopDeal.map((item, idx) => (
          <div key={idx} className="inline-block">
            
           <DealCard
item={{
    ...item, 
    id: item.id ?? 0,
    name: item.name ?? item.name,
    image: item.image,
    discount: item.discount ?? 0,
  }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deal;

