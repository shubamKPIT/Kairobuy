import { NextResponse } from "next/server";
import { requireUser } from "../../../../../lib/auth";
import razorpayInstance from "../../../../../lib/razorpay";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    if (process.env.ORDERS_DISABLED === "true") {
      return NextResponse.json(
        {
          message: "Orders are temporarily unavailable. Please try again later.",
        },
        {
          status: 503,
        }
      );
    }

    await requireUser(request);

    const { amount } = await request.json();

    // The final amount is re-checked against the cart when the order is saved
    if (!Number.isFinite(Number(amount)) || amount <= 0 || amount > 500000) {
      return NextResponse.json(
        {
          message: "Invalid amount",
        },
        {
          status: 400,
        }
      );
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    return NextResponse.json(
      {
        success: true,
        order,
        key: process.env.RAZORPAY_KEY_ID,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("RAZORPAY ORDER ERROR:", error);

    return NextResponse.json(
      {
        message: error.status
          ? error.message
          : "Failed to create Razorpay order",
      },
      {
        status: error.status || 500,
      }
    );
  }
}