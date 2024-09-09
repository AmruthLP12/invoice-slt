import axios from "axios";
import { toast } from "react-toastify";

interface Invoice {
  _id: string;
  customerName: string;
  phoneNumber: string;
  cardNumber: string;
  selectedDate: string;
  advance: number;
  today: string;
  isDelivered: boolean;
  deliveredAt?:string;
  rows: {
    description: string;
    qty: number;
    price: number;
    total: number;
  }[];
  totalAmount?: number;
  remainingAmount?: number;
}

// / Interface for InvoiceRow (from your components/types)
export interface InvoiceRow {
  description: string;
  qty: number;
  price: number;
  total: number;
}

// Interface for the Invoice data
export interface CreateInvoice {
  customerName: string;
  phoneNumber: string;
  cardNumber: string;
  selectedDate: Date | undefined;
  advance: number;
  rows: InvoiceRow[];
  today: Date;
}

// Fetch all invoices
export const fetchInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await axios.get("/api");
    return response.data.reverse(); // Assuming you want the latest invoices first
  } catch (error) {
    toast.error("Failed to fetch invoices.");
    throw error;
  }
};

// Mark an invoice as delivered
export const markInvoiceAsDelivered = async (invoiceId: string) => {
  try {
    await axios.put(`/api?mongoId=${invoiceId}&action=deliver`);
    toast.success("Invoice marked as delivered.");
  } catch (error) {
    toast.error("Failed to mark invoice as delivered.");
    throw error;
  }
};

// Mark an invoice as undelivered
export const markInvoiceAsUnDelivered = async (invoiceId: string) => {
  try {
    await axios.put(`/api?mongoId=${invoiceId}&action=unDeliver`);
    toast.success("Invoice marked as undelivered.");
  } catch (error) {
    toast.error("Failed to mark invoice as undelivered.");
    throw error;
  }
};

// Delete an invoice
export const deleteInvoice = async (invoiceId: string) => {
  try {
    await axios.delete(`/api?mongoId=${invoiceId}`);
    toast.success("Invoice deleted successfully.");
  } catch (error) {
    toast.error("Failed to delete invoice.");
    throw error;
  }
};

// Fetch details of a specific invoice
export const fetchInvoiceDetails = async (
  cardNumber: string
): Promise<Invoice> => {
  try {
    const response = await axios.get(`/api?cardNumber=${cardNumber}`);
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch invoice details.");
    throw error;
  }
};

// create an invoice

// Submit Invoice
export const submitInvoice = async (invoice: CreateInvoice) => {
  try {
    const response = await axios.post("/api/", invoice);

    if (response.status === 200) {
      toast.success("Invoice created successfully!");
      return true; // Return true if successful
    } else {
      toast.error("Failed to create invoice.");
      return false; // Return false if unsuccessful
    }
  } catch (error) {
    toast.error("An error occurred while creating the invoice.");
    throw error;
  }
};