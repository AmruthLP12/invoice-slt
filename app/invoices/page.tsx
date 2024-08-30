"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";
import BasicInvoiceInfo from "@/components/BasicInvoiceInfo";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { RefreshCcw } from "lucide-react"; // Import the reset icon

interface Invoice {
  _id: string;
  customerName: string;
  phoneNumber: string;
  cardNumber: string;
  selectedDate: string;
  advance: number;
  today: string;
  rows: {
    description: string;
    qty: number;
    price: number;
    total: number;
  }[];
}

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Renamed to generalize input
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("/api");
        const data = response.data.reverse();
        setInvoices(data);
        setFilteredInvoices(data);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to fetch invoices.");
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    // Filter invoices based on search criteria
    const filtered = invoices.filter((invoice) => {
      const matchesQuery =
        invoice.cardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate =
        selectedDate === undefined ||
        new Date(invoice.selectedDate).toLocaleDateString() ===
          selectedDate.toLocaleDateString();

      return matchesQuery && matchesDate;
    });

    setFilteredInvoices(filtered);
  }, [searchQuery, selectedDate, invoices]);

  const handleResetFilters = () => {
    setSearchQuery(""); // Reset search input
    setSelectedDate(undefined); // Reset date picker
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TailSpin height="80" width="80" color="black" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return <div>No invoices found.</div>;
  }

  // Prepare data for the BasicInvoiceInfo component
  const simplifiedInvoices = filteredInvoices.map((invoice) => {
    const grandTotal = invoice.rows.reduce((acc, row) => acc + row.total, 0);
    const remainingAmount = grandTotal - invoice.advance;
    return {
      cardNumber: invoice.cardNumber,
      selectedDate: new Date(invoice.selectedDate),
      advance: invoice.advance,
      totalAmount: grandTotal,
      remainingAmount,
      today: new Date(invoice.today),
      phoneNumber : invoice.phoneNumber,
    };
  });

  return (
    <>
      <ToastContainer theme="light" position="bottom-right" />
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Invoices</h2>
        <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row gap-4 mb-4">
          {/* Responsive Search and Date Picker */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by Card or Phone Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex-1">
            <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
          </div>
          <div>
            {/* Reset Filters Button */}
            <button
              onClick={handleResetFilters}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
              aria-label="Reset Filters"
            >
              <RefreshCcw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        <BasicInvoiceInfo invoices={simplifiedInvoices} />
      </div>
    </>
  );
};

export default InvoicesPage;
