"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker"; // Import the updated DatePicker component

import { fixedRows, tableHeaders } from "@/data";

interface InvoiceRow {
  description: string;
  qty: number;
  price: number;
  total: number;
}

const InvoiceTable: React.FC = () => {
  const [rows, setRows] = useState<InvoiceRow[]>(fixedRows);
  const [advance, setAdvance] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const today = new Date();

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const numericValue = value === "" ? 0 : parseFloat(value);
    const updatedRows = [...rows];

    if (name === "qty" || name === "price") {
      const qty = name === "qty" ? numericValue : updatedRows[index].qty;
      const price = name === "price" ? numericValue : updatedRows[index].price;
      updatedRows[index] = {
        ...updatedRows[index],
        qty: qty,
        price: price,
        total: qty * price,
      };
    } else {
      updatedRows[index] = {
        ...updatedRows[index],
        [name as keyof InvoiceRow]: numericValue,
      };
    }

    setRows(updatedRows);
  };

  const handleAdvanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      event.target.value === "" ? 0 : parseFloat(event.target.value);
    setAdvance(value);
  };

  const handleReset = () => {
    setRows(fixedRows);
    setAdvance(0);
    setSelectedDate(undefined);
  };

  // Calculate grand total
  const grandTotal = rows.reduce((acc, row) => acc + row.total, 0);
  const remainingAmount = grandTotal - advance;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Invoice Generator</h2>

      {/* Date Pickers */}
      <div className="mb-4 flex space-x-4">
        <div>
          <label className="block mb-1">Today's Date:</label>
          <DatePicker date={today} onDateChange={() => {}} />{" "}
          {/* Disabled Date Picker */}
        </div>
        <div>
          <label className="block mb-1">Select Date:</label>
          <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
        </div>
      </div>

      <Table className="w-full border-collapse border border-gray-200">
        <TableHeader>
          <TableRow>
            {tableHeaders.map((header) => (
              <TableCell
                key={header.key}
                className="border border-gray-300 p-2"
              >
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
                <input
                  type="number"
                  name="qty"
                  value={row.qty === 0 ? "" : row.qty} // Show empty string if zero
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </TableCell>
              <TableCell className="p-2">
                <input
                  type="number"
                  name="price"
                  value={row.price === 0 ? "" : row.price} // Show empty string if zero
                  onChange={(e) => handleChange(index, e)}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </TableCell>
              <TableCell className="p-2">{row.total}</TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-between">
        <div>
          <label className="block mb-1">Advance Payment:</label>
          <input
            type="number"
            value={advance === 0 ? "" : advance} // Show empty string if zero
            onChange={handleAdvanceChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Grand Total: {grandTotal}</h3>
          <h3 className="text-lg font-semibold">
            Remaining Amount: {remainingAmount}
          </h3>
        </div>
      </div>

      <Button onClick={handleReset} variant="destructive" className="mt-4">
        Reset
      </Button>
    </div>
  );
};

export default InvoiceTable;
