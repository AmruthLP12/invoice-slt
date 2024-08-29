// components/InvoiceTableBody.tsx
import React from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { InvoiceRow } from "@/components/types"; // Import InvoiceRow type

interface InvoiceTableBodyProps {
  rows: InvoiceRow[];
  handleChange: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  tableHeaders: { key: string; label: string }[];
}

const InvoiceTableBody: React.FC<InvoiceTableBodyProps> = ({
  rows,
  handleChange,
  tableHeaders,
}) => {
  return (
    <Table className="w-full border-collapse border border-gray-200">
      <TableHeader>
        <TableRow>
          {tableHeaders.map((header) => (
            <TableCell key={header.key} className="border border-gray-300 p-2">
              {header.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <motion.tr
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border border-gray-200"
          >
            <TableCell className="p-2">{row.description}</TableCell>
            <TableCell className="p-2">
              <Input
                type="number"
                name="qty"
                value={row.qty === 0 ? "" : row.qty}
                onChange={(e) => handleChange(index, e)}
                className="w-full p-1 border border-gray-300 rounded"
                placeholder="0"
              />
            </TableCell>
            <TableCell className="p-2">
              <Input
                type="number"
                name="price"
                value={row.price === 0 ? "" : row.price}
                onChange={(e) => handleChange(index, e)}
                className="w-full p-1 border border-gray-300 rounded"
                placeholder="0"
              />
            </TableCell>
            <TableCell className="p-2">{row.total}</TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoiceTableBody;
