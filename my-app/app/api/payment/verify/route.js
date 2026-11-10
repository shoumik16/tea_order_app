

import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";

import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      typeof razorpay_signature !== "string" ||
      !/^[a-f0-9]{64}$/i.test(razorpay_signature)
    ) {
      return NextResponse.json(
        { error: "Invalid payment information" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find payment using Razorpay order ID.
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    if (payment.status === "success") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified",
      });
    }

    // Verify Razorpay signature.
    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const signatureBuffer = Buffer.from(
      expectedSignature,
      "hex"
    );

    const receivedBuffer = Buffer.from(
      razorpay_signature,
      "hex"
    );

    const valid =
      signatureBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(
        signatureBuffer,
        receivedBuffer
      );

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Verify actual payment status with Razorpay.
    const razorpayPayment =
      await razorpay.payments.fetch(razorpay_payment_id);

    if (
      razorpayPayment.order_id !== payment.razorpayOrderId ||
      razorpayPayment.amount !== payment.amount * 100 ||
      razorpayPayment.currency !== "INR" ||
      razorpayPayment.status !== "captured"
    ) {
      return NextResponse.json(
        { error: "Payment not captured or amount mismatch" },
        { status: 400 }
      );
    }

    // Update payment status.
    payment.status = "success";
    payment.razorpayPaymentId = razorpay_payment_id;

    await payment.save();

    return NextResponse.json({
      success: true,
      message: "Payment successful",
    });

  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
