// types.ts
// / Interface for InvoiceRow 
declare interface InvoiceRow {
  description: string;
  qty: number;
  price: number;
  total: number;
  isExtra?: boolean;
}

declare interface Invoice {
  _id: string;
  customerName: string;
  phoneNumber: string;
  cardNumber: string;
  selectedDate: string;
  advance: number;
  today: string;
  isDelivered: boolean;
  deliveredAt?: string;
  rows: {
    description: string;
    qty: number;
    price: number;
    total: number;
  }[];
  totalAmount?: number;
  remainingAmount?: number;
}

declare interface BasicInvoiceInfoProps {
  invoices: {
    _id: string;
    cardNumber: string;
    selectedDate: Date;
    advance: number;
    totalAmount: number;
    remainingAmount: number;
    today: Date;
    phoneNumber: string;
    isDelivered: boolean;
    deliveredAt?: string;
    onMarkAsDelivered?: (cardNumber: string, newStatus: boolean) => void;
    onDelete?: (mongoId: string) => void;
  }[];
  filterDelivered?: boolean;
}

// Interface for the Invoice data
declare interface CreateInvoice {
    customerName: string;
    phoneNumber: string;
    cardNumber: string;
    selectedDate: Date | undefined;
    advance: number;
    rows: InvoiceRow[];
    today: Date;
  }