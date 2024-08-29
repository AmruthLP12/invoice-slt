"use client";

import React, { useState } from "react";

import { InvoiceRow } from "@/components/types"; // Import InvoiceRow type
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fixedRows, tableHeaders } from "@/data";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerDetails from "./CustomerDetails";
import DatePickers from "./DatePickers";
import InvoiceTableBody from "./InvoiceTableContent";
import axios from "axios";

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
  const handleSubmit = async () => {
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
    try {
      const response = await axios.post("/api/", {
        customerName,
        phoneNumber,
        cardNumber,
        selectedDate,
        advance,
        rows,
        today,
      });

      if (response.status === 200) {
        toast.success("Invoice created successfully!");
        handleReset(); // Reset form after successful submission
      } else {
        toast.error("Failed to create invoice.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the invoice.");
    }
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
        <CustomerDetails
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          customerName={customerName}
          setCustomerName={setCustomerName}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          isCardNumberValid={isCardNumberValid}
          setIsCardNumberValid={setIsCardNumberValid}
        />

        {/* Date Pickers */}
        <DatePickers
          today={today}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          isDateValid={isDateValid}
          setIsDateValid={setIsDateValid}
        />

        {/* Invoice Table */}
        <InvoiceTableBody
          rows={rows}
          handleChange={handleChange}
          tableHeaders={tableHeaders}
        />

        {/* Totals and Actions */}
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
