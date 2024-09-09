import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for individual invoice row
interface InvoiceRow {
  description: string;
  qty: number;
  price: number;
  total: number;
}

// Interface for the main invoice document
export interface InvoiceDocument extends Document {
  customerName: string;
  phoneNumber: string;
  cardNumber: string;
  selectedDate: Date;
  advance: number;
  rows: InvoiceRow[];
  today: Date;
  isDelivered: Boolean;
  deliveredAt: Date;
}

// Schema for individual invoice row
const InvoiceRowSchema = new Schema<InvoiceRow>({
  description: {
    type: String,
  },
  qty: {
    type: Number,
    min: 0,
  },
  price: {
    type: Number,
    min: 0,
  },
  total: {
    type: Number,
    min: 0,
  },
});

// Schema for the main invoice document
const InvoiceSchema = new Schema<InvoiceDocument>(
  {
    customerName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    cardNumber: {
      type: String,
    },
    selectedDate: {
      type: Date,
    },
    advance: {
      type: Number,
      min: 0,
    },
    rows: {
      type: [InvoiceRowSchema],
    },
    today: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },

  { timestamps: true }
);

const InvoiceModel: Model<InvoiceDocument> =
  mongoose.models.Invoice ||
  mongoose.model<InvoiceDocument>("Invoice", InvoiceSchema);

export default InvoiceModel;
