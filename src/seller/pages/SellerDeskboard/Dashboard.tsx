
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../../config/Api"; // your axios instance
import "./Dashboard.css";

interface DashboardStats {
  totalEarnings: number;
  totalSales: number;
  totalRefunds: number;
  totalTax: number;
  netEarnings: number;
  totalOrders: number;
  canceledOrders: number;
  totalTransactions: number;
}

interface CardItem {
  title: string;
  value: string;
}

interface ChartDataItem {
  time: string;
  revenue: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<CardItem[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get<DashboardStats>("/sellers/report");

        // Set stats cards
        setStats([
          { title: "Total Earnings", value: `₹${data.totalEarnings}` },
          { title: "Net Earnings", value: `₹${data.netEarnings}` },
          { title: "Total Sales", value: data.totalSales.toString() },
          { title: "Total Orders", value: data.totalOrders.toString() },
          { title: "Canceled Orders", value: data.canceledOrders.toString() },
          { title: "Refunds", value: `₹${data.totalRefunds}` },
          { title: "Tax", value: `₹${data.totalTax}` },
          { title: "Transactions", value: data.totalTransactions.toString() },
        ]);

        // Chart data example (split earnings over time)
        setChartData([
          { time: "00:00", revenue: data.totalEarnings * 0.1 },
          { time: "06:00", revenue: data.totalEarnings * 0.2 },
          { time: "12:00", revenue: data.totalEarnings * 0.3 },
          { time: "18:00", revenue: data.totalEarnings * 0.4 },
          { time: "24:00", revenue: data.totalEarnings },
        ]);
      } catch (err) {
        console.error("Dashboard API error:", err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="dashboard">
      {/* Top stats cards */}
      <div className="stats">
        {stats.map((item, i) => (
          <div className="card" key={i}>
            <p>{item.title}</p>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="chart-box">
        <h3>Revenue (Today)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4f8cff"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
