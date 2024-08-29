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
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [customerName, setCustomerName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [isDateValid, setIsDateValid] = useState<boolean>(true);
  const [isCardNumberValid, setIsCardNumberValid] = useState<boolean>(true);

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
    setCustomerName("");
    setPhoneNumber("");
    setCardNumber("");
  };

  // Handle submit button
  const handleSubmit = () => {
    let isValid = true;

    if (!cardNumber || !selectedDate) {
      isValid = false;
      toast.error("Please fill out all required fields");
    }

    if (!cardNumber) {
      isValid = false;
      setIsCardNumberValid(false); // Set validation to false if card number is empty
    }

    if (!selectedDate) {
      isValid = false;
      setIsDateValid(false); // Set validation to false if no date is selected
    }

    if (!isValid) {
      return; // Prevent submission if any validation fails
    }

    setIsCardNumberValid(true); // Reset validation state
    setIsDateValid(true); // Reset validation state

    // If all validations pass, continue with submission logic
    console.table({
      customerName,
      phoneNumber,
      cardNumber,
      selectedDate,
      advance,
      rows,
    });
  };

  // Calculate grand total
  const grandTotal = rows.reduce((acc, row) => acc + row.total, 0);
  const remainingAmount = grandTotal - advance;

  return (
    <>
      <ToastContainer theme="light" position="bottom-right" />
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Invoice Generator</h2>

        {/* Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-1">
              Card Number: <span className="text-red-700">*</span>
            </label>
            <Input
              type="text"
              value={cardNumber}
              onChange={(e) => {
                setCardNumber(e.target.value);
                setIsCardNumberValid(true); // Reset validation when user types
              }}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            {!isCardNumberValid && (
              <p className="text-red-500 text-sm">
                Please Enter the card number.
              </p> // Show error message
            )}
          </div>
          <div>
            <label className="block mb-1">Customer Name:</label>
            <Input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Phone Number:</label>
            <Input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Date Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-1">Today&apos;s Date:</label>
            <DatePicker date={today} onDateChange={() => {}} />{" "}
            {/* Disabled Date Picker */}
          </div>
          <div>
            <label className="block mb-1">
              Select Date:<span className="text-red-700">*</span>
            </label>
            <DatePicker
              date={selectedDate}
              onDateChange={(date) => {
                setSelectedDate(date);
                setIsDateValid(true);
              }}
            />
            {!isDateValid && (
              <p className="text-red-500 text-sm">Please select a date.</p> // Show error message
            )}
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
                  <Input
                    type="number"
                    name="qty"
                    value={row.qty === 0 ? "" : row.qty} // Show empty string if zero
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-1 border border-gray-300 rounded"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Input
                    type="number"
                    name="price"
                    value={row.price === 0 ? "" : row.price} // Show empty string if zero
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

        <div className="mt-4 flex justify-between">
          <div>
            <label className="block mb-1">Advance Payment:</label>
            <Input
              type="number"
              value={advance === 0 ? "" : advance} // Show empty string if zero
              onChange={handleAdvanceChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="0"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Grand Total: {grandTotal}</h3>
            <h3 className="text-lg font-semibold">
              Remaining Amount: {remainingAmount}
            </h3>
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <Button onClick={handleReset} variant="destructive">
            Reset
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-700 text-white hover:text-gray-300 hover:bg-green-600"
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default InvoiceTable;
