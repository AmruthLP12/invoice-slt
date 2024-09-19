"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { fetchInvoices } from "@/services/service";

const GlobalSearch = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Open modal on Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Fetch invoices on load
  useEffect(() => {
    const loadInvoices = async () => {
      const data = await fetchInvoices();
      setInvoices(data);
    };

    loadInvoices();
  }, []);

  // Filtered invoices based on search query (min 3 chars)
  const filteredInvoices =
    searchQuery.length >= 3
      ? invoices.filter(
          (invoice) =>
            invoice.cardNumber.includes(searchQuery) ||
            invoice.phoneNumber.includes(searchQuery)
        )
      : [];

  return (
    <>
      {/* Background Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)} // Close when clicking outside
        />
      )}

      {/* Modal Content */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-[90%] max-w-lg p-6 bg-white rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setSearchOpen(false)}
            >
              &times;
            </button>

            {/* Input for search */}
            <Input
              type="text"
              placeholder="Search by Card or Phone Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            {/* Filtered Invoices */}
            {searchQuery.length >= 3 && filteredInvoices.length > 0 ? (
              <ul>
                {filteredInvoices.map((invoice) => (
                  <li key={invoice._id} className="p-2 border-b">
                    Card: {invoice.cardNumber}, Phone: {invoice.phoneNumber}
                  </li>
                ))}
              </ul>
            ) : searchQuery.length >= 3 ? (
              <p>No results found</p>
            ) : (
              <p>Type at least 3 characters to search</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
