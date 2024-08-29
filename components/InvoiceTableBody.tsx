import React from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { InvoiceRow } from "@/components/types"; // Import InvoiceRow type
import { CircleMinus, CirclePlus } from "lucide-react";

interface InvoiceTableBodyProps {
  rows: InvoiceRow[];
  setRows: React.Dispatch<React.SetStateAction<InvoiceRow[]>>; // Add setRows prop
  handleChange: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  tableHeaders: { key: string; label: string }[];
}

const InvoiceTableBody: React.FC<InvoiceTableBodyProps> = ({
  rows,
  setRows, // Destructure setRows prop
  handleChange,
  tableHeaders,
}) => {
  const handleAddRow = (index: number) => {
    const newRow = {
      description: rows[index].description,
      qty: 0, // Set to default value
      price: 0, // Set to default value
      total: 0, // Set to default value
      isExtra: true, // Mark the new row as an extra
    };
    
    const updatedRows = [...rows];
    updatedRows.splice(index + 1, 0, newRow); // Insert the new row right after the current one
    setRows(updatedRows);
  };

  const handleRemoveRow = (index: number) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index); // Remove the row at the given index
    setRows(updatedRows);
  };

  return (
    <Table className="w-full border-collapse border border-gray-200">
      <TableHeader>
        <TableRow>
          {tableHeaders.map((header) => (
            <TableCell key={header.key} className="border border-gray-300 p-2">
              {header.label}
            </TableCell>
          ))}
          <TableCell className="border border-gray-300 p-2">Actions</TableCell>{" "}
          {/* Actions header */}
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
            <TableCell className="p-2 flex gap-2">
              {" "}
              {/* Actions cell */}
              <button
                onClick={() => handleAddRow(index)}
                className="text-green-600"
              >
                <CirclePlus className="h-5 w-5" />
              </button>
              {row.isExtra && ( // Only show the minus button for extra rows
                <button
                  onClick={() => handleRemoveRow(index)}
                  className="text-red-600"
                >
                  <CircleMinus className="h-5 w-5" />
                </button>
              )}
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoiceTableBody;
