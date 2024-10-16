"use client";

import { InvoiceRow } from "@/components/types"; // Import InvoiceRow type
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fixedRows, tableHeaders } from "@/data";
import {
  checkCardNumberExists,
  fetchNextCardNumber,
  submitInvoice,
} from "@/services/service";
import { IconDeviceFloppy, IconPrinter } from "@tabler/icons-react";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerDetails from "./CustomerDetails";
import DatePickers from "./DatePickers";
import InvoiceTableBody from "./InvoiceTableBody";

const InvoiceTable: React.FC = () => {
  const router = useRouter();

  const [rows, setRows] = useState<InvoiceRow[]>(fixedRows);
  const [advance, setAdvance] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [customerName, setCustomerName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [isDateValid, setIsDateValid] = useState<boolean>(true);
  const [isCardNumberValid, setIsCardNumberValid] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [today, setToday] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayDate = new Date();
  const componentRef = useRef<HTMLDivElement>(null); // Reference for the print content

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
    setToday(todayDate);
  };

  const handleSubmit = async () => {
    let isValid = true;
  
    const trimmedPhoneNumber = phoneNumber.split(" ").join("");
  
    if (!cardNumber || !selectedDate) {
      isValid = false;
      toast.error("Please fill out all required fields");
    }
  
    if (!cardNumber) {
      isValid = false;
      setIsCardNumberValid(false);
    }
  
    if (!selectedDate) {
      isValid = false;
      setIsDateValid(false);
    }
  
    if (!isValid) {
      return;
    }
  
    setIsCardNumberValid(true);
    setIsDateValid(true);
  
    setIsLoading(true);
  
    try {
      const existingInvoice = await checkCardNumberExists(cardNumber);
  
      if (existingInvoice) {
        toast.error("Card number already exists. Please use a different card number.");
        return;
      }
  
      const invoice = {
        customerName,
        phoneNumber: trimmedPhoneNumber,
        cardNumber,
        selectedDate,
        advance,
        rows,
        today,
      };
  
      const success = await submitInvoice(invoice);
      if (success) {
        handleReset();
        const nextCardNumber = await fetchNextCardNumber();
        setCardNumber(nextCardNumber ?? "");
  
        return cardNumber;
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error("Error occurred during submission.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handlePrintResult = async () => {
    try {
      setIsSubmitting(true);
      const savedCardNumber = await handleSubmit(); // Save invoice and get the cardNumber
      if (savedCardNumber) {
        // Show success toast notification
        // toast.success("Invoice saved successfully!");

        // Wait for 2 seconds before redirecting (you can adjust the time as needed)
        setTimeout(() => {
          // Navigate to the print page using the saved cardNumber
          router.push(`/invoices/${savedCardNumber}`);
        }, 5000); // 2000 milliseconds = 2 seconds
      }
    } catch (error) {
      console.error("Error saving invoice or navigating to print page:", error);
      toast.error("An error occurred while saving the invoice.");
    } finally {
      setIsSubmitting(false); // Reset submitting state after printing completes
    }
  };

  // Calculate grand total
  const grandTotal = rows.reduce((acc, row) => acc + row.total, 0);
  const remainingAmount = grandTotal - advance;

  const disableScrollOnInput = (event: React.WheelEvent<HTMLInputElement>) => {
    event.currentTarget.blur(); // Optionally blur the input to prevent the scroll
    event.preventDefault(); // Prevent the default scroll behavior
  };

  return (
    <>
      <ToastContainer theme="light" position="bottom-right" />

      {/* Full-Screen Loader */}

      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-center">
            <h2 className="text-white text-2xl font-bold">
              Saving and redirecting to print page...
            </h2>
            <TailSpin
              height="8"
              width="8"
              color="white"
              wrapperClass="justify-center"
            />
          </div>
        </div>
      )}

      {/* {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <TailSpin height="80" width="80" color="white" />
        </div>
      )} */}

      <div
        className={`p-6 bg-white shadow-md rounded-lg ${
          isLoading ? "opacity-50 pointer-events-none" : ""
        }`}
        ref={componentRef} // Reference the component to be printed
      >
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
          setToday={setToday}
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
          setRows={setRows}
        />

        {/* Totals and Actions */}
        <div className="mt-4 flex justify-between">
          <div>
            <label className="block mb-1">Advance Payment:</label>
            <Input
              type="number"
              value={advance === 0 ? "" : advance} // Show empty string if zero
              onChange={handleAdvanceChange}
              onWheel={disableScrollOnInput} // Disable scrolling
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

        <div className="mt-4 flex gap-4 print:hidden">
          {/* Reset Button with Refresh Icon */}
          <Button
            onClick={handleReset}
            variant="destructive"
            className="flex items-center space-x-2 px-4 py-2 rounded-md"
          >
            <RefreshCcw size={20} className="text-white" />
            <span>Reset</span>
          </Button>

          {/* Submit Button with Checkmark Icon */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex items-center space-x-2 bg-green-700 text-white hover:text-gray-300 hover:bg-green-600 px-4 py-2 rounded-md ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <IconDeviceFloppy size={20} className="text-white" />
            <span>Save</span>
          </Button>

          {/* Save and Print Button with Printer Icon */}
          <Button
            onClick={handlePrintResult}
            className="flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-300 focus:ring focus:ring-blue-300 px-4 py-2 rounded-md print:hidden"
          >
            <IconPrinter size={20} className="text-blue-100" />
            <span>Save and Print</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default InvoiceTable;