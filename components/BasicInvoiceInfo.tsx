import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { invoiceStyles } from "@/Styles/styles";
import { format } from "date-fns";
import Link from "next/link";
import React, { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import DeliveryStatusConfirmationModal from "./DeliveryStatusConfirmationModal";

const BasicInvoiceInfo: React.FC<BasicInvoiceInfoProps> = ({
  invoices,
  filterDelivered,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const [selectedCardNumber, setSelectedCardNumber] = useState<string | null>(
    null
  );
  const [deliveryStatus, setDeliveryStatus] = useState<boolean | null>(null);

  const handleDelete = (mongoId: string, cardNumber: string) => {
    setSelectedInvoiceId(mongoId);
    setSelectedCardNumber(cardNumber);
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
    setSelectedCardNumber(null);
  };

  const handleToggleDelivery = (cardNumber: string, currentStatus: boolean) => {
    setSelectedInvoiceId(cardNumber);
    setDeliveryStatus(!currentStatus); // Toggle the delivery status
    setDeliveryModalOpen(true);
  };

  const confirmToggleDelivery = () => {
    if (selectedInvoiceId !== null && deliveryStatus !== null) {
      const invoiceToToggle = invoices.find(
        (invoice) => invoice.cardNumber === selectedInvoiceId
      );
      invoiceToToggle?.onMarkAsDelivered?.(selectedInvoiceId, deliveryStatus);
    }
    setDeliveryModalOpen(false);
    setSelectedInvoiceId(null);
    setDeliveryStatus(null);
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
            <TableCell className={`${invoiceStyles.tableCellHead} `}>
              Card Number
            </TableCell>
            <TableCell className={`${invoiceStyles.tableCellHead}`}>
              Phone Number
            </TableCell>
            <TableCell className={`${invoiceStyles.tableCellHead}`}>
              Received Date
            </TableCell>
            <TableCell className={`${invoiceStyles.tableCellHead}`}>
              Delivery Date
            </TableCell>
            {filterDelivered && (
              <TableCell className={`${invoiceStyles.tableCellHead}`}>
                Delivered Date
              </TableCell>
            )}
            <TableCell className={`${invoiceStyles.tableCellHead}`}>
              Total Amount
            </TableCell>
            <TableCell className={`${invoiceStyles.tableCellHead}`}>
              Advance
            </TableCell>
            <TableCell className={`${invoiceStyles.tableCellHead}`}>
              Remaining Amount
            </TableCell>
            <TableCell className={`${invoiceStyles.tableCellHead}`}>
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
              <TableRow key={index} className="border border-gray-200">
                <TableCell
                  className={`${invoiceStyles.tableCell} ${rowClasses}`}
                >
                  <Link href={`/invoices/${invoice.cardNumber}`}>
                    <p
                      className={`!text-blue-500 hover:underline ${rowClasses}`}
                    >
                      {invoice.cardNumber}
                    </p>
                  </Link>
                </TableCell>
                <TableCell
                  className={`${invoiceStyles.tableCell} ${rowClasses}`}
                >
                  {invoice.phoneNumber}
                </TableCell>
                <TableCell
                  className={`${invoiceStyles.tableCell} ${rowClasses}`}
                >
                  {format(invoice.today, "dd/MM/yyyy")}
                </TableCell>
                <TableCell
                  className={`${invoiceStyles.tableCell} ${rowClasses}`}
                >
                  {format(invoice.selectedDate, "dd/MM/yyyy")}
                </TableCell>
                {filterDelivered && invoice.isDelivered && (
                  <TableCell
                    className={`${invoiceStyles.tableCell} ${rowClasses}`}
                  >
                    {invoice.deliveredAt
                      ? format(invoice.deliveredAt, "dd/MM/yyyy")
                      : "-"}
                  </TableCell>
                )}
                <TableCell
                  className={`${invoiceStyles.tableCell} ${rowClasses}`}
                >
                  ₹{invoice.totalAmount}
                </TableCell>
                <TableCell
                  className={`${invoiceStyles.tableCell} ${rowClasses}`}
                >
                  ₹{invoice.advance}
                </TableCell>
                <TableCell
                  className={`${invoiceStyles.tableCell} ${rowClasses}`}
                >
                  ₹{invoice.remainingAmount}
                </TableCell>
                <TableCell className="p-2">
                  <div className="flex flex-col gap-2 md:flex-row">
                    <Button
                      onClick={() =>
                        handleToggleDelivery(
                          invoice.cardNumber,
                          invoice.isDelivered
                        )
                      }
                      className={
                        invoice.isDelivered
                          ? invoiceStyles.deliveredButton
                          : invoiceStyles.undeliveredButton
                      }
                    >
                      {invoice.isDelivered
                        ? "Mark as Undelivered"
                        : "Mark as Delivered"}
                    </Button>
                    <Button
                      onClick={() =>
                        handleDelete(invoice._id, invoice.cardNumber)
                      }
                      className={invoiceStyles.deleteButton}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        cardNumber={selectedCardNumber}
      />

      {/* Delivery Status Confirmation Modal */}
      <DeliveryStatusConfirmationModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setDeliveryModalOpen(false)}
        onConfirm={confirmToggleDelivery}
        deliveryStatus={deliveryStatus}
        cardNumber={selectedInvoiceId}
      />
    </>
  );
};

export default BasicInvoiceInfo;
