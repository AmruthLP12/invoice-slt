"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Invoice {
  _id: string;
  customerName: string;
  phoneNumber: string;
  cardNumber: string;
  selectedDate: string;
  advance: number;
  rows: {
    description: string;
    qty: number;
    price: number;
    total: number;
  }[];
  today: string;
}

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("/api");
        setInvoices(response.data);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to fetch invoices.");
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (invoices.length === 0) {
    return <div>No invoices found.</div>;
  }

  return (
    <>
      <ToastContainer theme="light" position="bottom-right" />
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Invoices</h2>
        {invoices.map((invoice) => {
          // Calculate grand total
          const grandTotal = invoice.rows.reduce((acc, row) => acc + row.total, 0);

          // Calculate remaining amount
          const remainingAmount = grandTotal - invoice.advance;

          return (
            <div key={invoice._id} className="mb-6 p-4 border rounded-lg">
              <h3 className="text-lg font-bold">{invoice.customerName}</h3>
              <p>Phone: {invoice.phoneNumber}</p>
              <p>Card Number: {invoice.cardNumber}</p>
              <p>Date: {new Date(invoice.selectedDate).toLocaleDateString()}</p>
              <p>Advance: ${invoice.advance}</p>
              <p>Date Created: {new Date(invoice.today).toLocaleDateString()}</p>
              <table className="mt-4 w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Qty</th>
                    <th className="border p-2">Price</th>
                    <th className="border p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.rows.map((row, index) => (
                    <tr key={index}>
                      <td className="border p-2">{row.description}</td>
                      <td className="border p-2 text-center">{row.qty}</td>
                      <td className="border p-2 text-right">${row.price}</td>
                      <td className="border p-2 text-right">${row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4 className="mt-4 text-lg font-bold">
                Grand Total: ${grandTotal}
              </h4>
              <h4 className="mt-1 text-lg font-bold">
                Remaining Amount: ${remainingAmount}
              </h4>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default InvoicesPage;
