import { connectDb } from "@/lib/config/db";
import InvoiceModel from "@/lib/models/InvoiceModel";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const LoadDB = async () => {
  await connectDb();
};

LoadDB();

export async function GET() {
  await connectDb();

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
  await LoadDB(); // Ensure DB is connected
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
}

export async function DELETE(request: NextRequest) {
  await LoadDB(); // Ensure DB is connected
  const mongoId = request.nextUrl.searchParams.get("mongoId");
  if (!mongoId) {
    return NextResponse.json({ msg: "ID not provided" }, { status: 400 });
  }

  await InvoiceModel.findByIdAndDelete(mongoId);

  return NextResponse.json({ msg: "Invoice Deleted" });
}

export async function PUT(request: NextRequest) {
  await LoadDB(); // Ensure DB is connected
  const mongoId = request.nextUrl.searchParams.get("mongoId");
  const action = request.nextUrl.searchParams.get("action");

  if (!mongoId || !action) {
    return NextResponse.json({ msg: "Invalid request" }, { status: 400 });
  }

  const updateData =
    action === "pending" ? { isCompleted: false } : { isCompleted: true };

  await InvoiceModel.findByIdAndUpdate(mongoId, {
    $set: updateData,
  });

  const message =
    action === "pending" ? "Invoice Marked as Pending" : "Invoice Completed";

  return NextResponse.json({ msg: message });
}
