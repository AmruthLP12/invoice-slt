// components/CustomerDetails.tsx
import React from "react";
import { Input } from "@/components/ui/input";

interface CustomerDetailsProps {
  cardNumber: string;
  setCardNumber: React.Dispatch<React.SetStateAction<string>>;
  customerName: string;
  setCustomerName: React.Dispatch<React.SetStateAction<string>>;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  isCardNumberValid: boolean;
  setIsCardNumberValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  cardNumber,
  setCardNumber,
  customerName,
  setCustomerName,
  phoneNumber,
  setPhoneNumber,
  isCardNumberValid,
  setIsCardNumberValid,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block mb-1">
          Card Number: <span className="text-red-700">*</span>
        </label>
        <Input
          type="number"
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
          </p>
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
          type="number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </div>
  );
};

export default CustomerDetails;
