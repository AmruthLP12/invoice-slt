// app/api/route.ts

import { connectDb } from "@/lib/config/db";
import InvoiceModel from "@/lib/models/InvoiceModel";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const loadDb = async () => {
  await connectDb();
};

export async function GET(request: NextRequest) {
  await loadDb();

  const cardNumber = request.nextUrl.searchParams.get("cardNumber");
  const phoneNumber = request.nextUrl.searchParams.get("phoneNumber");

  if (cardNumber) {
    try {
      const invoice = await InvoiceModel.findOne({ cardNumber });
      if (!invoice) {
        return NextResponse.json(
          { error: "Invoice not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(invoice);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch invoice" },
        { status: 500 }
      );
    }
  }

  if (phoneNumber) {
    try {
      const suggestions = await InvoiceModel.find({
        phoneNumber: { $regex: phoneNumber, $options: "i" },
      }).distinct("phoneNumber");

      return NextResponse.json(suggestions);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch suggestions" },
        { status: 500 }
      );
    }
  }

  try {
    const invoices = await InvoiceModel.find({});
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await loadDb();

  try {
    const {
      customerName,
      phoneNumber,
      cardNumber,
      selectedDate,
      rows,
      advance,
      today,
    } = await request.json();

    await InvoiceModel.create({
      customerName,
      phoneNumber,
      cardNumber,
      selectedDate,
      rows,
      advance,
      today,
    });

    return NextResponse.json({ msg: "Invoice Created" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  await loadDb();

  const mongoId = request.nextUrl.searchParams.get("mongoId");
  if (!mongoId) {
    return NextResponse.json({ msg: "ID not provided" }, { status: 400 });
  }

  try {
    await InvoiceModel.findByIdAndDelete(mongoId);
    return NextResponse.json({ msg: "Invoice Deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  await loadDb();

  const mongoId = request.nextUrl.searchParams.get("mongoId");
  const action = request.nextUrl.searchParams.get("action");

  if (!mongoId || !action) {
    return NextResponse.json({ msg: "Invalid request" }, { status: 400 });
  }

  const updateData =
    action === "deliver" ? { isDelivered: true } : { isDelivered: false };

  try {
    await InvoiceModel.findByIdAndUpdate(mongoId, {
      $set: updateData,
    });
    const message =
      action === "deliver" ? "Invoice Marked as Delivered" : "Invoice Marked as Undelivered";
    return NextResponse.json({ msg: message });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

