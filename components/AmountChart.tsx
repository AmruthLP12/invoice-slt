"use client";
import { fetchInvoices } from "@/services/service";
import { IconArrowBadgeLeft, IconArrowBadgeRight } from "@tabler/icons-react";
import { Chart, ChartConfiguration } from "chart.js";
import { endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { labels } from "@/data";

const AmountChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [chartData, setChartData] = useState<ChartConfiguration["data"] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date()));
  const [weekRange, setWeekRange] = useState<string>("");
  const [totalDelivered, setTotalDelivered] = useState<number>(0);
  const [totalDeliveredInvoices, setTotalDeliveredInvoices] = useState<number>(0);

  const fetchAndSetInvoices = async (weekStart: Date) => {
    try {
      const invoices = await fetchInvoices();

      // Initialize array for delivered amounts
      const deliveredAmount = new Array(7).fill(0);
      let deliveredTotal = 0;
      let deliveredInvoiceCount = 0;

      invoices.forEach((invoice) => {
        // Only process if the invoice is marked as delivered and has a delivery date
        if (invoice.isDelivered && invoice.deliveredAt) {
          const deliveredDate = new Date(invoice.deliveredAt);
          const grandTotal = invoice.rows.reduce((acc, row) => acc + row.total, 0);

          // Only count invoices delivered within the current week
          if (deliveredDate >= weekStart && deliveredDate <= endOfWeek(weekStart)) {
            const day = deliveredDate.getDay();
            deliveredAmount[day] += grandTotal;
            deliveredTotal += grandTotal;
            deliveredInvoiceCount += 1; 
          }
        }
      });

      setTotalDelivered(deliveredTotal);
      setTotalDeliveredInvoices(deliveredInvoiceCount);

      // Set chart data with total delivered amount in label
      setChartData({
        labels,
        datasets: [
          {
            data: deliveredAmount,
            label: `Amount (Total Delivered: ${deliveredTotal})`, // Display total delivered in label
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
      setLoading(false);
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
      <h1 className="text-xl font-semibold text-center mt-6">Weekly Delivered Amount Report</h1>
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
        <div className="flex flex-row items-center gap-16">
          <div className="text-lg font-medium mb-4">{`Week of ${weekRange}`}</div>
          {/* Display total delivered amount below the chart */}
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">{`Total Delivered Amount: ${totalDelivered}`}</p>
            <p className="text-lg font-semibold">{`Total Delivered Invoices: ${totalDeliveredInvoices}`}</p>
          </div>
        </div>
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
};

export default AmountChart;
