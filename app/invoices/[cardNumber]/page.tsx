"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchInvoiceDetails } from "@/services/service";

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

  useEffect(() => {
    const loadInvoiceDetails = async () => {
      try {
        if (!cardNumber) return;
        const data = await fetchInvoiceDetails(cardNumber); // Use service function
        setInvoice(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false); // Error handling is done in the service
      }
    };

    loadInvoiceDetails();
  }, [cardNumber]);


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
      <div className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6">Invoice Details</h2>
        <div className="mb-6 space-y-4">
          <div className="flex flex-col space-y-2">
            <p className="text-lg font-semibold">
              <strong>Customer Name:</strong> {invoice.customerName}
            </p>
            <p className="text-lg font-semibold">
              <strong>Phone Number:</strong> {invoice.phoneNumber}
            </p>
            <p className="text-lg font-semibold">
              <strong>Card Number:</strong> {invoice.cardNumber}
            </p>
            <p className="text-lg font-semibold">
              <strong>Selected Date:</strong>{" "}
              {new Date(invoice.selectedDate).toLocaleDateString()}
            </p>
            <p className="text-lg font-semibold">
              <strong>Advance:</strong> ₹{invoice.advance.toFixed(2)}
            </p>
            <p className="text-lg font-semibold">
              <strong>Date Created:</strong>{" "}
              {new Date(invoice.today).toLocaleDateString()}
            </p>
            <p className="text-lg font-semibold">
              <strong>Total Amount:</strong> {grandTotal}
            </p>
            <p className="text-lg font-semibold">
              <strong>Remaining Amount:</strong> {remainingAmount}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Invoice Items:</h3>
        <Table className="w-full border-collapse border border-gray-300">
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
            {invoice.rows.map((row, index) => (
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
      </div>
    </>
  );
};

export default InvoiceDetails;
