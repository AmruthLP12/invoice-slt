"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchInvoiceDetails } from "@/services/service";
import React, { useEffect, useState, useRef } from "react";
import { TailSpin } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { IconPrinter } from "@tabler/icons-react";

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

interface InvoicePrintProps {
  cardNumber?: string;
  mongoId?: string;
}

const InvoicePrint: React.FC<InvoicePrintProps> = ({ cardNumber, mongoId }) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadInvoiceDetails = async () => {
      try {
        if (!cardNumber && !mongoId) return;
        const data = await fetchInvoiceDetails(cardNumber || mongoId!);
        setInvoice(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    loadInvoiceDetails();
  }, [cardNumber, mongoId]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Invoice Details",
    onAfterPrint: () => alert("Print successful!"),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TailSpin height="80" width="80" color="black" />
      </div>
    );
  }

  if (!invoice) {
    return <div>No invoice details available.</div>;
  }

  const grandTotal = invoice.rows.reduce((acc, row) => acc + row.total, 0);
  const remainingAmount = grandTotal - invoice.advance;

  return (
    <>
      <div
        className="p-6 bg-white shadow-md rounded-lg border border-gray-200"
        ref={componentRef}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Invoice Details</h2>
          <Button
            onClick={handlePrint}
            className="text-blue-500 hover:text-blue-700 print:hidden"
          >
            <IconPrinter size={24} />
          </Button>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <p><strong>Customer Name:</strong> {invoice.customerName}</p>
          <p><strong>Phone Number:</strong> {invoice.phoneNumber}</p>
          <p><strong>Card Number:</strong> {invoice.cardNumber}</p>
          <p><strong>Received Date:</strong> {new Date(invoice.today).toLocaleDateString()}</p>
          <p><strong>Delivery Date:</strong> {new Date(invoice.selectedDate).toLocaleDateString()}</p>
        </div>

        {/* Invoice Items Table */}
        <Table className="w-full border-collapse border border-gray-300 mb-6">
          <TableHeader>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.qty}</TableCell>
                <TableCell>₹{row.price.toFixed(2)}</TableCell>
                <TableCell>₹{row.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Amount Details */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <p><strong>Total Amount:</strong> ₹{grandTotal.toFixed(2)}</p>
          <p><strong>Advance:</strong> ₹{invoice.advance.toFixed(2)}</p>
          <p><strong>Remaining Amount:</strong> ₹{remainingAmount.toFixed(2)}</p>
        </div>
      </div>
    </>
  );
};

export default InvoicePrint;
