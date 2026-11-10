
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/mongodb";

import Payment from "@/models/Payment";
import User from "@/models/User";

import { auth } from "@/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {


    // Receive all payment information.
    const {
      username,
      amount,
      donatorName,
      message,
    } = await req.json();

    const allowedAmounts = [5, 10, 20];

    // Validate amount.
    if (!allowedAmounts.includes(Number(amount))) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Validate donator name.
    if (
      typeof donatorName !== "string" ||
      !donatorName.trim() ||
      donatorName.length > 100
    ) {
      return NextResponse.json(
        { error: "Please provide a valid donator name" },
        { status: 400 }
      );
    }

    // Validate message.
    if (
      typeof message !== "string" ||
      message.length > 500
    ) {
      return NextResponse.json(
        { error: "Message must be under 500 characters" },
        { status: 400 }
      );
    }

    if (
      typeof username !== "string" ||
      !username.trim()
    ) {
      return NextResponse.json(
        { error: "Invalid recipient username" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find authenticated user.
    const recipient = await User.findOne({
      username: username,
    });

    if (!recipient) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create Razorpay order.
    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `payment_${Date.now()}`,
      notes: {
        username: username.trim(),
        donatorName: donatorName.trim(),
        message: message.trim(),
      },
    });

    // Save pending payment in MongoDB.
    await Payment.create({
      toUser: username.trim(),
      amount: Number(amount),
      status: "pending",

      message: message.trim(),

      user: donatorName.trim(),
      razorpayOrderId: order.id,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
