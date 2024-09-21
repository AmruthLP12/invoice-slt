"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { fetchInvoices } from "@/services/service";
import Link from "next/link";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import HotKeys from "./HotKeys";

const GlobalSearch = () => {
  const route = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const modalRef = useRef<HTMLDivElement>(null); // Create a ref for the modal
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input

  // Fetch invoices on load
  useEffect(() => {
    const loadInvoices = async () => {
      const data = await fetchInvoices();
      setInvoices(data);
    };

    loadInvoices();
  }, []);

  // Shortcuts
  const shortcuts = [
    {
      keys: ["ctrl", "k"],
      callback: () => {setSearchOpen(true),
      console.log("k")}
    },
    {
      keys: ["esc"],
      callback: () => {
        setSearchOpen(false);
        setSearchQuery(""); // Optional: clear the search query when closing
        console.log("esc")
      },
    },
    {
      keys: ["ctrl", "h"],
      callback: () => route.push("/"),
    },
    {
      keys: ["ctrl", "i"],
      callback: () => route.push("/invoices"),
    },
    {
      keys: ["ctrl", "d"],
      callback: () => route.push("/delivered"),
    },
    {
      keys: ["ctrl", "g"],
      callback: () => route.push("/dashboard"),
    },
  ];

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    } else {
      window.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

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
      <HotKeys shortcuts={shortcuts} />
      {/* Custom search card in top-right corner */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <div
          onClick={() => setSearchOpen(true)}
          className="flex items-center p-2 mr-10 bg-white border border-gray-300 rounded-full shadow-md cursor-pointer hover:bg-gray-100"
        >
          <IconSearch className="w-5 h-5 text-gray-600" />
          <span className="ml-2 text-gray-600">Ctrl &#43; K</span>
        </div>
      </div>

      {/* Background Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm" />
      )}

      {/* Modal Content */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center gap-2">
          <div
            ref={modalRef} // Attach the ref to the modal content
            className="w-[90%] max-w-lg p-6 bg-white rounded-lg shadow-lg relative"
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900 text-2xl font-bold transition-all"
              onClick={() => setSearchOpen(false)}
            >
              &times;
            </button>

            {/* Input for search */}
            <Input
              ref={inputRef} // Attach the input ref to the input element
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
                    Card:
                    <Link
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      href={`/invoices/${invoice.cardNumber}`}
                    >
                      {invoice.cardNumber}
                    </Link>
                    , Phone: {invoice.phoneNumber}
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
