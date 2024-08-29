import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BasicInvoiceInfoProps {
  invoices: {
    cardNumber: string;
    selectedDate: Date;
    advance: number;
    totalAmount: number;
    remainingAmount: number;
    today: Date;
  }[];
}

const BasicInvoiceInfo: React.FC<BasicInvoiceInfoProps> = ({ invoices }) => {
  return (
    <Table className="w-full border-collapse border border-gray-200">
      <TableHeader>
        <TableRow>
          <TableCell className="border border-gray-300 p-2">Card Number</TableCell>
          <TableCell className="border border-gray-300 p-2">Given Date</TableCell>
          <TableCell className="border border-gray-300 p-2">Delivery Date</TableCell>
          <TableCell className="border border-gray-300 p-2">Total Amount</TableCell>
          <TableCell className="border border-gray-300 p-2">Advance</TableCell>
          <TableCell className="border border-gray-300 p-2">Remaining Amount</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice, index) => (
          <TableRow key={index} className="border border-gray-200">
            <TableCell className="p-2">
              {/* Wrap card number with a Link */}
              <Link href={`/invoices/₹{invoice.cardNumber}`}>
                <p className="text-blue-500 hover:underline">{invoice.cardNumber}</p>
              </Link>
            </TableCell>
            <TableCell className="p-2">{invoice.today.toLocaleDateString()}</TableCell>
            <TableCell className="p-2">{invoice.selectedDate.toLocaleDateString()}</TableCell>
            <TableCell className="p-2">₹{invoice.totalAmount}</TableCell>
            <TableCell className="p-2">₹{invoice.advance}</TableCell>
            <TableCell className="p-2">₹{invoice.remainingAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BasicInvoiceInfo;
