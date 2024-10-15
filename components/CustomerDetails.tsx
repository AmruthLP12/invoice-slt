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
  const [rawPhoneNumber, setRawPhoneNumber] = useState<string>(''); // Raw phone number without formatting

  // Format phone number with spaces after every 5 digits
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters (like spaces) first
    const rawValue = value.replace(/\D/g, '');

    // Group digits in chunks of 5 (for Indian phone numbers)
    return rawValue.replace(/(\d{5})(\d+)/, '$1 $2');
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Remove any spaces or non-digit characters for raw phone number
    const rawValue = input.replace(/\D/g, '');
    setRawPhoneNumber(rawValue); // Store the raw number for API requests

    // Format the input value with spaces
    const formattedNumber = formatPhoneNumber(input);
    setPhoneNumber(formattedNumber); // Store the formatted number for display
  };

  // Fetch the last card number when the component mounts
  useEffect(() => {
    const getLastCardNumber = async () => {
      try {
        const lastNumber = await fetchNextCardNumber();
        setLastCardNumber(lastNumber);
        console.log("lastNumber", lastNumber);
      } catch (error) {
        console.error("Failed to fetch the last card number:", error);
      }
    };

    getLastCardNumber();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (rawPhoneNumber) { // Use the raw phone number for the API request
        try {
          const response = await axios.get(`/api/?phoneNumber=${rawPhoneNumber}`);
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
  }, [rawPhoneNumber]); // Trigger the API call when the raw phone number changes

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block mb-1">
          Card Number: <span className="text-red-700">*</span>
        </label>
        <Input
          type="number"
          value={cardNumber || lastCardNumber || ''}
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
          type="text" // Keep type as text to handle spaces
          value={phoneNumber} // Display the formatted phone number
          onChange={handlePhoneNumberChange} // Handle formatting and raw value
          className="w-full p-2 border border-gray-300 rounded"
        />
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded shadow-md max-h-40 overflow-y-auto z-10">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setRawPhoneNumber(suggestion); // Set the raw value
                  setPhoneNumber(formatPhoneNumber(suggestion)); // Set the formatted value
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


