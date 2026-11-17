import { NextResponse } from "next/server";
import { requireUser } from "../../../../../lib/auth";
import { connectDatabase } from "../../../../../lib/db";
import razorpayInstance from "../../../../../lib/razorpay";
import {
  buildTrustedItems,
  calculateTotals,
  createHttpError,
} from "../../../../../lib/orderPricing";

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

    const { items } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      throw createHttpError("Cart is empty", 400);
    }

    await connectDatabase();

    // The amount is calculated here from database prices.
    // Nothing about the price is taken from the browser.
    const orderItems = await buildTrustedItems(items);
    const { total } = calculateTotals(orderItems);

    if (!Number.isFinite(total) || total <= 0 || total > 500000) {
      throw createHttpError("Invalid amount", 400);
    }

    const options = {
      amount: Math.round(total * 100),
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