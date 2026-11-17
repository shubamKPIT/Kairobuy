import mongoose from "mongoose";
import Product from "../models/Product";

// Flat shipping charge for every order (GST is included in all prices)
export const SHIPPING_CHARGE = 30;

export function createHttpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function toQuantity(value) {
  const quantity = Math.floor(Number(value));

  return Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
}

/*
  Builds order items from the DATABASE, not from the browser.

  The browser only tells us which product, size and quantity.
  Name, image and price always come from the product record, so a
  customer cannot change prices by editing the request.
*/
export async function buildTrustedItems(items) {
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
  Single source of truth for order totals.
  Used by both the order route and the Razorpay order route, so the
  amount charged and the amount saved can never differ.
*/
export function calculateTotals(orderItems) {
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingCharge = SHIPPING_CHARGE;
  const total = subtotal + shippingCharge;

  return { subtotal, shippingCharge, total };
}