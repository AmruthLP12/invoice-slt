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
import { InvoiceRow } from "@/components/types";
import { CircleMinus, CirclePlus } from "lucide-react";

interface InvoiceTableBodyProps {
  rows: InvoiceRow[];
  setRows: React.Dispatch<React.SetStateAction<InvoiceRow[]>>;
  handleChange: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  tableHeaders: { key: string; label: string }[];
}

const InvoiceTableBody: React.FC<InvoiceTableBodyProps> = ({
  rows,
  setRows,
  handleChange,
  tableHeaders,
}) => {
  const handleAddRow = (index: number) => {
    const newRow = {
      description: rows[index].description,
      qty: 0,
      price: 0,
      total: 0,
      isExtra: true,
    };

    const updatedRows = [...rows];
    updatedRows.splice(index + 1, 0, newRow);
    setRows(updatedRows);
  };

  const handleRemoveRow = (index: number) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  };

  const disableScrollOnInput = (event: React.WheelEvent<HTMLInputElement>) => {
    event.currentTarget.blur(); // Optionally blur the input to prevent the scroll
    event.preventDefault(); // Prevent the default scroll behavior
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
          <TableCell className="border border-gray-300 p-2">Actions</TableCell>
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
                onWheel={disableScrollOnInput} // Disable scrolling
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
                onWheel={disableScrollOnInput} // Disable scrolling
                className="w-full p-1 border border-gray-300 rounded"
                placeholder="0"
              />
            </TableCell>
            <TableCell className="p-2">{row.total}</TableCell>
            <TableCell className="p-2 flex gap-2">
              <button
                onClick={() => handleAddRow(index)}
                className="text-green-600"
              >
                <CirclePlus className="h-5 w-5" />
              </button>
              {row.isExtra && (
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
