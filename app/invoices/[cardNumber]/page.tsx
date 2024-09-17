"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchInvoiceDetails } from "@/services/service";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import { IconPrinter } from "@tabler/icons-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import "react-toastify/dist/ReactToastify.css";

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

const InvoiceDetails: React.FC = () => {
  const { cardNumber } = useParams<{ cardNumber: string }>();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadInvoiceDetails = async () => {
      try {
        if (!cardNumber) return;
        const data = await fetchInvoiceDetails(cardNumber);
        setInvoice(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    loadInvoiceDetails();
  }, [cardNumber]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Invoice Details",
    onAfterPrint: () => {
      toast.success("Print successful!");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TailSpin height="80" width="80" color="black" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        No details found for this invoice.
      </div>
    );
  }

  const grandTotal = invoice.rows.reduce((acc, row) => acc + row.total, 0);
  const remainingAmount = grandTotal - invoice.advance;

  return (
    <>
      <ToastContainer theme="light" position="bottom-right" />
      <div
        className="p-6 bg-white shadow-md rounded-lg border border-gray-200"
        ref={componentRef}
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Sumithra Ladies Tailors</h1>
          <p className="text-lg">
            H C P Complex, Hesaraghatta, Bangalore - 560088
          </p>
          <p className="text-lg">Phone: 9538733164, 9620143033</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Invoice Details</h2>
          <Button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-blue-100 text-blue-600 hover:bg-blue-200 focus:ring focus:ring-blue-300 px-4 py-2 rounded-md print:hidden"
          >
            <IconPrinter size={20} className="text-blue-600" />
            <span>Print</span>
          </Button>
        </div>

        {/* Customer Details Section */}
        <div className="grid grid-cols-3 gap-4 mb-6 items-center">
          <p className="text-lg font-semibold">
            <strong>Card Number:</strong> {invoice.cardNumber}
          </p>
          <p className="text-lg font-semibold">
            <strong>Customer Name:</strong> {invoice.customerName}
          </p>
          <p className="text-lg font-semibold">
            <strong>Phone Number:</strong> {invoice.phoneNumber}
          </p>
          <p className="text-lg font-semibold">
            <strong>Received Created:</strong>{" "}
            {new Date(invoice.today).toLocaleDateString()}
          </p>
          <p className="text-lg font-semibold">
            <strong>Delivery Date:</strong>{" "}
            {new Date(invoice.selectedDate).toLocaleDateString()}
          </p>
        </div>

        {/* Invoice Items Table */}
        <h3 className="text-xl font-semibold mb-4">Invoice Items:</h3>
        <Table className="w-full border-collapse border border-gray-300 mb-6">
          <TableHeader>
            <TableRow>
              <TableCell className="border border-gray-300 p-2 font-medium">
                Description
              </TableCell>
              <TableCell className="border border-gray-300 p-2 font-medium">
                Quantity
              </TableCell>
              <TableCell className="border border-gray-300 p-2 font-medium">
                Price
              </TableCell>
              <TableCell className="border border-gray-300 p-2 font-medium">
                Total
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.rows
              .filter((row) => row.qty > 0)
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="border border-gray-300 p-2">
                    {row.description}
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2 text-center">
                    {row.qty}
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2 text-right">
                    ₹{row.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2 text-right">
                    ₹{row.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Amount Details Section */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <p className="text-lg font-semibold">
            <strong>Total Amount:</strong> ₹{grandTotal.toFixed(2)}
          </p>
          <p className="text-lg font-semibold">
            <strong>Advance:</strong> ₹{invoice.advance.toFixed(2)}
          </p>
          <p className="text-lg font-semibold">
            <strong>Remaining Amount:</strong> ₹{remainingAmount.toFixed(2)}
          </p>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetails;
