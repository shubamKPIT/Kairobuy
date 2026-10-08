import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { requireAdmin, requireUser } from "../../../lib/auth";
import { connectDatabase } from "../../../lib/db";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import "../../../models/User";
import razorpayInstance from "../../../lib/razorpay";

export const runtime = "nodejs";

function createHttpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function toQuantity(value) {
  const quantity = Math.floor(Number(value));

  return Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
}

const FREE_SHIPPING_ABOVE = 5000;
const SHIPPING_CHARGE = 199;

/*
  Builds order items from the DATABASE, not from the browser.

  The browser only tells us which product, size and quantity.
  Name, image and price always come from the product record, so a
  customer cannot change prices by editing the request.
*/
async function buildTrustedItems(items) {
  const trustedItems = [];

  for (const item of items) {
    const productId = String(item?.productId || item?._id || "");
    const quantity = toQuantity(item?.quantity);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw createHttpError("A product in your bag is invalid.", 400);
    }

    if (quantity < 1 || quantity > 20) {
      throw createHttpError("Invalid quantity in your bag.", 400);
    }

    const product = await Product.findById(productId)
      .select("name image price isActive purchaseMode source")
      .lean();

    if (!product || product.isActive === false) {
      throw createHttpError(
        `${item?.name || "A product"} is no longer available.`,
        404
      );
    }

    if (product.purchaseMode === "EXTERNAL_LINK" || product.source === "AMAZON") {
      throw createHttpError(
        `${product.name} is sold on a partner website and cannot be ordered here.`,
        400
      );
    }

    trustedItems.push({
      productId,
      name: product.name,
      image: product.image,
      price: Number(product.price || 0),
      quantity,
      selectedSize: String(item?.selectedSize || "").trim(),
    });
  }

  return trustedItems;
}

/*
  Confirms with Razorpay (using the secret key, server to server) that the
  payment really happened, belongs to this Razorpay order, and matches the
  total we calculated.
*/
async function verifyOnlinePayment({ paymentId, razorpayOrderId, total }) {
  if (!paymentId || !razorpayOrderId) {
    throw createHttpError("Payment details are missing.", 400);
  }

  const alreadyUsed = await Order.exists({
    $or: [{ paymentId }, { razorpayOrderId }],
  });

  if (alreadyUsed) {
    throw createHttpError("This payment has already been used.", 409);
  }

  let payment;

  try {
    payment = await razorpayInstance.payments.fetch(paymentId);
  } catch {
    throw createHttpError("Unable to verify your payment.", 402);
  }

  const expectedAmount = Math.round(total * 100);

  const isValid =
    payment?.order_id === razorpayOrderId &&
    payment?.amount === expectedAmount &&
    ["captured", "authorized"].includes(payment?.status);

  if (!isValid) {
    throw createHttpError(
      "Payment does not match this order. Please contact support if money was deducted.",
      402
    );
  }
}

function validateShippingAddress(address) {
  const fields = ["fullName", "phone", "address", "city", "state", "pincode"];

  const clean = {};

  for (const field of fields) {
    clean[field] = String(address?.[field] || "").trim();

    if (!clean[field]) {
      throw createHttpError("Please fill all shipping details.", 400);
    }
  }

  if (!/^\d{10}$/.test(clean.phone) || !/^\d{6}$/.test(clean.pincode)) {
    throw createHttpError("Phone or pincode is not valid.", 400);
  }

  return clean;
}

async function restoreSizeStock(reservedItems) {
  for (const item of reservedItems) {
    await Product.updateOne(
      {
        _id: item.productId,
        "sizes.label": item.selectedSize,
      },
      {
        $inc: {
          "sizes.$.stock": item.quantity,
          stock: item.quantity,
        },
      }
    );
  }
}

/*
  Checks and reduces stock for products that have sizes.

  Each reduction is one atomic update that only succeeds while the chosen
  size still has enough stock, so two customers cannot buy the last item.
  If any item fails, everything reduced so far is restored.
*/
async function reserveSizeStock(items) {
  const reservedItems = [];

  try {
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        throw createHttpError("A product in your bag is invalid.", 400);
      }

      if (item.quantity < 1) {
        throw createHttpError("Invalid quantity in your bag.", 400);
      }

      const product = await Product.findById(item.productId)
        .select("name sizes")
        .lean();

      if (!product) {
        if (item.selectedSize) {
          throw createHttpError(
            `${item.name || "A product"} is no longer available.`,
            404
          );
        }

        continue;
      }

      const hasSizes =
        Array.isArray(product.sizes) && product.sizes.length > 0;

      // Products without sizes keep their existing behaviour.
      if (!hasSizes) {
        continue;
      }

      if (!item.selectedSize) {
        throw createHttpError(
          `Please select a size for ${product.name}.`,
          400
        );
      }

      const result = await Product.updateOne(
        {
          _id: product._id,
          sizes: {
            $elemMatch: {
              label: item.selectedSize,
              stock: { $gte: item.quantity },
            },
          },
        },
        {
          $inc: {
            "sizes.$.stock": -item.quantity,
            stock: -item.quantity,
          },
        }
      );

      if (result.modifiedCount !== 1) {
        throw createHttpError(
          `Size ${item.selectedSize} of ${product.name} does not have enough stock.`,
          409
        );
      }

      reservedItems.push(item);
    }
  } catch (error) {
    await restoreSizeStock(reservedItems);
    throw error;
  }

  return reservedItems;
}

export async function POST(request) {
  try {
    // Server-side switch: set ORDERS_DISABLED=true in your environment
    // variables to stop all new orders, even from direct API calls.
    if (process.env.ORDERS_DISABLED === "true") {
      throw createHttpError(
        "Orders are temporarily unavailable. Please try again later.",
        503
      );
    }

    const user = await requireUser(request);

    const { items, shippingAddress, paymentMethod, paymentId, razorpayOrderId } =
      await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          message: "Cart is empty",
        },
        {
          status: 400,
        }
      );
    }

    await connectDatabase();

    const cleanAddress = validateShippingAddress(shippingAddress);

    // Prices come from the database, totals are calculated here
    const orderItems = await buildTrustedItems(items);

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shippingCharge = subtotal > FREE_SHIPPING_ABOVE ? 0 : SHIPPING_CHARGE;
    const total = subtotal + shippingCharge;

    const method = paymentMethod === "online" ? "online" : "cod";
    let paymentStatus = "Pending";

    if (method === "online") {
      await verifyOnlinePayment({ paymentId, razorpayOrderId, total });
      paymentStatus = "Paid";
    }

    const reservedItems = await reserveSizeStock(orderItems);

    try {
      const newOrder = new Order({
        userId: user._id,
        items: orderItems,
        shippingAddress: cleanAddress,
        subtotal,
        shippingCharge,
        total,
        paymentMethod: method,
        paymentStatus,
        paymentId: method === "online" ? paymentId : "",
        razorpayOrderId: method === "online" ? razorpayOrderId : "",
      });

      await newOrder.save();

      return NextResponse.json(
        {
          message: "Order placed successfully",
          order: newOrder,
        },
        {
          status: 201,
        }
      );
    } catch (saveError) {
      await restoreSizeStock(reservedItems);
      throw saveError;
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: error.status || 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    await requireAdmin(request);
    await connectDatabase();

    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({
        createdAt: -1,
      });

    return NextResponse.json(orders, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: error.status || 500,
      }
    );
  }
}