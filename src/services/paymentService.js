import { apiRequest } from "../lib/api";

// The server calculates the amount from the cart items, so we send the
// items (product, size, quantity) and not a price.
export function createRazorpayOrder(items, token) {
  return apiRequest("/payments/razorpay/order", {
    method: "POST",
    body: { items },
    token,
  });
}

export function verifyRazorpayPayment(paymentData, token) {
  return apiRequest("/payments/razorpay/verify", {
    method: "POST",
    body: paymentData,
    token,
  });
}