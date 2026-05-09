
import { CheckCircle, FiberManualRecord } from "@mui/icons-material";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

interface Step {
  name: string;
  description: string;
  value: string;
}

const steps: Step[] = [
  { name: "Order Placed", description: "Order successfully placed", value: "PENDING" },
  { name: "Packed", description: "Item packed in warehouse", value: "CONFIRM" },
  { name: "Shipped", description: "Order shipped", value: "SHIPPED" },
  { name: "Arriving", description: "Out for delivery", value: "ARRIVING" },
  { name: "Delivered", description: "Delivered successfully", value: "DELIVERED" },
];

const cancelledSteps: Step[] = [
  { name: "Order Placed", description: "Order placed", value: "PENDING" },
  { name: "Cancelled", description: "Order cancelled", value: "CANCELLED" },
];

const statusIndexMap: Record<string, number> = {
  PENDING: 0,
  CONFIRM: 1,
  SHIPPED: 2,
  ARRIVING: 3,
  DELIVERED: 4,
};

const OrderSteper = ({ orderStatus }: { orderStatus: string }) => {
  const [activeSteps, setActiveSteps] = useState<Step[]>(steps);
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    if (orderStatus === "CANCELLED") {
      setActiveSteps(cancelledSteps);
      setCurrentStep(1);
    } else {
      setActiveSteps(steps);
      setCurrentStep(
        orderStatus in statusIndexMap ? statusIndexMap[orderStatus] : 0
      );
    }
  }, [orderStatus]);

  return (
    <Box className="my-10">
      {activeSteps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={index} className="flex px-4">
            {/* LEFT ICON + LINE */}
            <div className="flex flex-col items-center">
              <Box
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${
                    index <= currentStep
                      ? orderStatus === "CANCELLED"
                        ? "bg-red-100 text-red-500"
                        : "bg-teal-100 text-teal-600"
                      : "bg-gray-200 text-gray-400"
                  }`}
              >
                {orderStatus === "CANCELLED" && isActive ? (
                  <FiberManualRecord />
                ) : index <= currentStep ? (
                  <CheckCircle />
                ) : (
                  <FiberManualRecord />
                )}
              </Box>

              {index !== activeSteps.length - 1 && (
                <div
                  className={`flex-1 w-[2px]
                    ${
                      isCompleted
                        ? orderStatus === "CANCELLED"
                          ? "bg-red-400"
                          : "bg-teal-500"
                        : "bg-gray-300"
                    }`}
                />
              )}
            </div>

            {/* RIGHT CONTENT */}
            <div className="ml-4 w-full">
              <div
                className={`p-2 rounded-md
                  ${
                    isActive
                      ? orderStatus === "CANCELLED"
                        ? "bg-red-500 text-white"
                        : "bg-primary-color text-white"
                      : ""
                  }`}
              >
                <p className="font-medium">{step.name}</p>
                <p
                  className={`text-xs ${
                    isActive ? "text-gray-100" : "text-gray-500"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </Box>
  );
};

export default OrderSteper;
