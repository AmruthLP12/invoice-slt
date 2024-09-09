import React, { useState } from "react";
import CustomModal from "./CustomModal";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface BasicInvoiceInfoProps {
  invoices: {
    _id: string;
    cardNumber: string;
    selectedDate: Date;
    advance: number;
    totalAmount: number;
    remainingAmount: number;
    today: Date;
    phoneNumber: string;
    isDelivered: boolean;
    deliveredAt?: Date;
    onMarkAsDelivered?: (cardNumber: string) => void;
    onDelete?: (mongoId: string) => void;
  }[];
  filterDelivered?: boolean;
}

const BasicInvoiceInfo: React.FC<BasicInvoiceInfoProps> = ({
  invoices,
  filterDelivered,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );

  const handleDelete = (mongoId: string) => {
    setSelectedInvoiceId(mongoId);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedInvoiceId) {
      const invoiceToDelete = invoices.find(
        (invoice) => invoice._id === selectedInvoiceId
      );
      invoiceToDelete?.onDelete?.(selectedInvoiceId);
    }
    setModalOpen(false);
    setSelectedInvoiceId(null);
  };

  const filteredInvoices =
    filterDelivered === undefined
      ? invoices
      : invoices.filter((invoice) => invoice.isDelivered === filterDelivered);

  return (
    <>
      <Table className="w-full border-collapse border border-gray-200">
        <TableHeader>
          <TableRow>
            <TableCell className="border border-gray-300 p-2">
              Card Number
            </TableCell>
            <TableCell className="border border-gray-300 p-2">
              Phone Number
            </TableCell>
            <TableCell className="border border-gray-300 p-2">
              Given Date
            </TableCell>
            <TableCell className="border border-gray-300 p-2">
              Delivery Date
            </TableCell>
            {filterDelivered && (
              <TableCell className="border border-gray-300 p-2">
                Delivered At
              </TableCell>
            )}
            <TableCell className="border border-gray-300 p-2">
              Total Amount
            </TableCell>
            <TableCell className="border border-gray-300 p-2">
              Advance
            </TableCell>
            <TableCell className="border border-gray-300 p-2">
              Remaining Amount
            </TableCell>
            <TableCell className="border border-gray-300 p-2">
              Actions
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.map((invoice, index) => {
            const rowClasses = invoice.isDelivered
              ? "line-through text-gray-500"
              : "";

            return (
              <TableRow
                key={index}
                className={`border border-gray-200 ${rowClasses}`}
              >
                <TableCell className={`p-2 ${rowClasses}`}>
                  <Link href={`/invoices/${invoice.cardNumber}`}>
                    <p
                      className={`!text-blue-500 hover:underline ${rowClasses}`}
                    >
                      {invoice.cardNumber}
                    </p>
                  </Link>
                </TableCell>
                <TableCell className={`p-2 ${rowClasses}`}>
                  {invoice.phoneNumber}
                </TableCell>
                <TableCell className={`p-2 ${rowClasses}`}>
                  {format(invoice.today, "dd/MM/yyyy")}
                </TableCell>
                <TableCell className={`p-2 ${rowClasses}`}>
                  {format(invoice.selectedDate, "dd/MM/yyyy")}
                </TableCell>
                {filterDelivered && invoice.isDelivered && (
                  <TableCell className={`p-2 ${rowClasses}`}>
                    {invoice.deliveredAt ? format(invoice.deliveredAt, "dd/MM/yyyy") : "-"}
                  </TableCell>
                )}
                <TableCell className={`p-2 ${rowClasses}`}>
                  ₹{invoice.totalAmount}
                </TableCell>
                <TableCell className={`p-2 ${rowClasses}`}>
                  ₹{invoice.advance}
                </TableCell>
                <TableCell className={`p-2 ${rowClasses}`}>
                  ₹{invoice.remainingAmount}
                </TableCell>
                <TableCell className="p-2">
                  {invoice.isDelivered ? (
                    <Button
                      onClick={() =>
                        invoice.onMarkAsDelivered?.(invoice.cardNumber)
                      }
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      Mark as Undelivered
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        invoice.onMarkAsDelivered?.(invoice.cardNumber)
                      }
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(invoice._id)}
                    className="ml-2 bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Delete confirmation modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
      >
        <h2 className="text-lg font-semibold mb-4 text-center">
          Are you sure you want to delete this invoice?
        </h2>
        <p className="mb-6 text-center">This action cannot be undone.</p>
      </CustomModal>
    </>
  );
};

export default BasicInvoiceInfo;
