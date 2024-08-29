import { connectDb } from "@/lib/config/db";
import TodoModel from "@/lib/models/TodoModel";
import { NextResponse } from "next/server";

const LoadDB = async () => {
  await connectDb();
};

LoadDB();

export async function GET(request) {
  const todos = await TodoModel.find({});
  return NextResponse.json({ todos: todos });
}

export async function POST(request) {
  const { title, description } = await request.json();

  await TodoModel.create({
    title,
    description,
  });

  return NextResponse.json({ msg: "Todo Created" });
}

export async function DELETE(request) {
  const mongoId = await request.nextUrl.searchParams.get("mongoId");
  await TodoModel.findByIdAndDelete(mongoId);

  return NextResponse.json({ msg: "Todo Deleted" });
}

export async function PUT(request) {
  const mongoId = request.nextUrl.searchParams.get("mongoId");
  const action = request.nextUrl.searchParams.get("action");

  const updateData =
    action === "pending" ? { isCompleted: false } : { isCompleted: true };

  await TodoModel.findByIdAndUpdate(mongoId, {
    $set: updateData,
  });

  const message =
    action === "pending" ? "Todo Marked as Pending" : "Todo Completed";

  return NextResponse.json({ msg: message });
}
