"use client";
import { useEffect, useRef, useState } from "react";
import { Chart, ChartConfiguration } from "chart.js";
import axios from "axios";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import { format, subWeeks, startOfWeek, endOfWeek } from "date-fns";
import { IconArrowBadgeLeft, IconArrowBadgeRight } from "@tabler/icons-react";
import { fetchInvoices } from "@/services/service";

interface Invoice {
  _id: string;
  customerName: string;
  phoneNumber: string;
  cardNumber: string;
  selectedDate: string;
  advance: number;
  today: string;
  isDelivered: boolean;
  rows: {
    description: string;
    qty: number;
    price: number;
    total: number;
  }[];
  totalAmount?: number;
  remainingAmount?: number;
}

function Example() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [chartData, setChartData] = useState<ChartConfiguration["data"] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date()));
  const [weekRange, setWeekRange] = useState<string>("");

  const fetchAndSetInvoices = async (weekStart: Date) => {
    try {
      const invoices = await fetchInvoices();

      // Process invoices to get the data for the chart
      const labels = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const receivedIn = new Array(7).fill(0);
      const delivered = new Array(7).fill(0);

      invoices.forEach((invoice) => {
        const invoiceDate = new Date(invoice.today);
        if (invoiceDate >= weekStart && invoiceDate <= endOfWeek(weekStart)) {
          const day = invoiceDate.getDay();
          receivedIn[day]++;

          if (invoice.isDelivered) {
            delivered[day]++;
          }
        }
      });

      setChartData({
        labels,
        datasets: [
          {
            data: receivedIn,
            label: "Received",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
          },
          {
            data: delivered,
            label: "Delivered",
            borderColor: "#3cba9f",
            backgroundColor: "#71d1bd",
            fill: false,
          },
        ],
      });

      // Set the current week range
      const start = format(weekStart, "MMM d, yyyy");
      const end = format(endOfWeek(weekStart), "MMM d, yyyy");
      setWeekRange(`${start} - ${end}`);
    } catch (error) {
      console.error("Error fetching or processing invoices:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAndSetInvoices(currentWeek);
  }, [currentWeek]);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");
    if (ctx && chartData) {
      const config: ChartConfiguration = {
        type: "line",
        data: chartData,
      };

      const myChart = new Chart(ctx, config);

      return () => {
        myChart.destroy();
      };
    }
  }, [chartData]);

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    const nextWeekStart = subWeeks(currentWeek, -1);
    if (nextWeekStart <= startOfWeek(new Date())) {
      setCurrentWeek(nextWeekStart);
    }
  };

  return (
    <>
      {/* line chart */}
      <h1 className="text-xl font-semibold text-center mt-6">Weekly Report</h1>
      <div className="flex flex-col items-center px-4 py-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={handlePreviousWeek}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <IconArrowBadgeLeft />
          </button>
          <button
            onClick={handleNextWeek}
            className={`px-4 py-2 rounded-lg hover:bg-blue-600 ${
              currentWeek >= startOfWeek(new Date())
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
            disabled={currentWeek >= startOfWeek(new Date())}
          >
            <IconArrowBadgeRight />
          </button>
        </div>
        <div className="text-lg font-medium mb-4">{`Week of ${weekRange}`}</div>
        <div className="w-full max-w-full md:max-w-[800px] lg:max-w-[1000px] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] border border-gray-300 pt-4 rounded-xl shadow-lg relative">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <TailSpin height="80" width="80" color="black" />
            </div>
          ) : (
            <canvas ref={chartRef} id="myChart" className="h-full w-full" />
          )}
        </div>
      </div>
    </>
  );
}

export default Example;
