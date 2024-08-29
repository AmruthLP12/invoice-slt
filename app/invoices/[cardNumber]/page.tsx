"use client";

import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
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
    const fetchInvoiceDetails = async () => {
      try {
        if (!cardNumber) return;
        const response = await axios.get(`/api?cardNumber=${cardNumber}`);
        setInvoice(response.data);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to fetch invoice details.");
        setIsLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [cardNumber]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TailSpin height="80" width="80" color="black" />
      </div>
    );
  }

  if (!invoice) {
    return <div>No details found for this invoice.</div>;
  }

  return (
    <>
      <ToastContainer theme="light" position="bottom-right" />
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
        <p><strong>Customer Name:</strong> {invoice.customerName}</p>
        <p><strong>Phone Number:</strong> {invoice.phoneNumber}</p>
        <p><strong>Card Number:</strong> {invoice.cardNumber}</p>
        <p><strong>Selected Date:</strong> {new Date(invoice.selectedDate).toLocaleDateString()}</p>
        <p><strong>Advance:</strong> ${invoice.advance}</p>
        <p><strong>Date Created:</strong> {new Date(invoice.today).toLocaleDateString()}</p>
        
        <h3 className="text-lg font-semibold mt-4">Invoice Items:</h3>
        <Table>
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
                <TableCell>${row.price}</TableCell>
                <TableCell>${row.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default InvoiceDetails;
