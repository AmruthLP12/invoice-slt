"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";
import BasicInvoiceInfo from "@/components/BasicInvoiceInfo";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { RefreshCcw } from "lucide-react"; // Import the reset icon
import { Button } from "@/components/ui/button";
import { fetchInvoices, markInvoiceAsUnDelivered } from "@/services/service"; // Import the service functions

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

const DeliveredPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await fetchInvoices(); // Use the service function to fetch invoices
        setInvoices(data);
        setFilteredInvoices(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    loadInvoices();
  }, []);

  useEffect(() => {
    const filtered = invoices.filter((invoice) => {
      const matchesQuery =
        invoice.cardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate =
        selectedDate === undefined ||
        new Date(invoice.selectedDate).toLocaleDateString() ===
          selectedDate.toLocaleDateString();
      const isDelivered = invoice.isDelivered;

      return matchesQuery && matchesDate && isDelivered;
    });

    setFilteredInvoices(filtered);
  }, [searchQuery, selectedDate, invoices]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDate(undefined);
  };

  const handleMarkAsUnDelivered = async (invoiceId: string) => {
    await markInvoiceAsUnDelivered(invoiceId); // Use the service function to mark as undelivered
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice._id === invoiceId ? { ...invoice, isDelivered: false } : invoice
      )
    );
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

  const simplifiedInvoices = filteredInvoices.map((invoice) => {
    const grandTotal = invoice.rows.reduce((acc, row) => acc + row.total, 0);
    const remainingAmount = grandTotal - invoice.advance;

    return {
      ...invoice,
      totalAmount: grandTotal,
      remainingAmount,
      selectedDate: new Date(invoice.selectedDate),
      today: new Date(invoice.today),
    };
  });

  return (
    <>
      <ToastContainer theme="light" position="bottom-right" />
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Delivered Invoices</h2>
        <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row gap-4 mb-4">
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
            <Button
              onClick={handleResetFilters}
              className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
              aria-label="Reset Filters"
            >
              <RefreshCcw className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
        <BasicInvoiceInfo
          invoices={simplifiedInvoices.map((invoice) => ({
            ...invoice,
            onMarkAsDelivered: (cardNumber: string) =>
              handleMarkAsUnDelivered(invoice._id),
          }))}
          filterDelivered={true} // Only delivered invoices
        />
      </div>
    </>
  );
};

export default DeliveredPage;
