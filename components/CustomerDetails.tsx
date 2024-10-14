import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { fetchNextCardNumber } from "@/services/service";

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const [lastCardNumber, setLastCardNumber] = useState<string | null>(null);

  // Fetch the last card number when the component mounts
  useEffect(() => {
    const getLastCardNumber = async () => {
      try {
        const lastNumber = await fetchNextCardNumber();
        setLastCardNumber(lastNumber);
        console.log("lastNumber",lastNumber)
      } catch (error) {
        console.error("Failed to fetch the last card number:", error);
      }
    };

    getLastCardNumber();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (phoneNumber) {
        try {
          const response = await axios.get(`/api/?phoneNumber=${phoneNumber}`);
          setSuggestions(response.data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [phoneNumber]);

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
          placeholder={lastCardNumber || "Enter card number"}
        />
        {!isCardNumberValid && (
          <p className="text-red-500 text-sm">Please Enter the card number.</p>
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
      <div className="relative">
        <label className="block mb-1">Phone Number:</label>
        <Input
          type="number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded shadow-md max-h-40 overflow-y-auto z-10">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setPhoneNumber(suggestion);
                  setShowSuggestions(false);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
