import React, { useEffect, useState } from "react";

const DealTimer = ({ expiryTime }: { expiryTime: string }) => {

  const getTimeLeft = () => {
    const diff = new Date(expiryTime).getTime() - new Date().getTime();

    if (diff <= 0) return null;

    return {
      hours: Math.floor(diff / (1000 * 60 * 60) % 24),
      minutes: Math.floor(diff / (1000 * 60) % 60),
      seconds: Math.floor(diff / 1000 % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<any>(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime]);

  if (!timeLeft) {
    return <p className="text-red-600 font-bold">Deal Expired ⛔</p>;
  }

  return (
    <p className="text-blue-600 font-semibold">
      ⏳ {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
    </p>
  );
};

export default DealTimer;