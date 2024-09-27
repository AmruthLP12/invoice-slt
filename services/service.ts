import axios from "axios";
import { toast } from "react-toastify";

// interface Invoice {
//   _id: string;
//   customerName: string;
//   phoneNumber: string;
//   cardNumber: string;
//   selectedDate: string;
//   advance: number;
//   today: string;
//   isDelivered: boolean;
//   deliveredAt?:string;
//   rows: {
//     description: string;
//     qty: number;
//     price: number;
//     total: number;
//   }[];
//   totalAmount?: number;
//   remainingAmount?: number;
// }

// // / Interface for InvoiceRow (from your components/types)
// export interface InvoiceRow {
//   description: string;
//   qty: number;
//   price: number;
//   total: number;
// }

// Interface for the Invoice data
// export interface CreateInvoice {
//   customerName: string;
//   phoneNumber: string;
//   cardNumber: string;
//   selectedDate: Date | undefined;
//   advance: number;
//   rows: InvoiceRow[];
//   today: Date;
// }

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

// fetch delivered invoices
export const fetchDeliveredInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await axios.get("/api"); // Fetch all invoices from your API
    const invoices = response.data;

    // Filter to only return invoices with isDelivered: true and sort by deliveredAt (descending)
    const deliveredInvoices = invoices
      .filter((invoice: Invoice) => invoice.isDelivered && invoice.deliveredAt) // Ensure deliveredAt exists
      .sort((a: Invoice, b: Invoice) => 
        new Date(b.deliveredAt!).getTime() - new Date(a.deliveredAt!).getTime()
      ); // Sort by deliveredAt in reverse order

    return deliveredInvoices;
  } catch (error) {
    toast.error("Failed to fetch delivered invoices.");
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
    toast.warning("Invoice deleted successfully.");
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

export const registerUser = async (username: string, password: string) => {
  try {
    const response = await axios.post('/api/auth/register', { username, password });
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { data: null, error: error.response.data.message };
    }
    return { data: null, error: 'Registration failed. Please try again later.' };
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post('/api/auth/login', { username, password });
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;
      return { data: null, error: serverMessage || 'Login failed. Please try again later.' };
    }
    return { data: null, error: 'An unexpected error occurred.' };
  }
};


export const fetchUser = async () => {
  try {
    const response = await axios.get('/api/auth/user');
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { data: null, error: 'User is not authenticated' };
    }
    return { data: null, error: 'An unexpected error occurred.' };
  }
};

export const logoutUser = async () => {
  try {
    await axios.post('/api/auth/logout'); // Make sure you have this API endpoint
    return { success: true, error: null };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;
      return { success: false, error: serverMessage || 'Logout failed. Please try again later.' };
    }
    return { success: false, error: 'An unexpected error occurred.' };
  }
};
