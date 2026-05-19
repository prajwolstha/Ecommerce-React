import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useOrders } from "../context/OrderContext.jsx";
import { loadStripe } from "@stripe/stripe-js";

// ─── PASTE YOUR PUBLISHABLE KEY HERE ────────────────────────────────────────
const STRIPE_PUBLISHABLE_KEY = "pk_test_51TXu9vAgRIViKXXBSbnJbu172cX02Hpuj2zUt1wVjgxUg5rn4b4DUQAkp0lSJagxLzr2wAlqZuiUXs2iOaTxbXdK00Rt5cAG7F";// ────────────────────────────────────────────────────────────────────────────

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({
    name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
  });
  const [payment, setPayment] = useState({ method: "cod" });
  const [errors, setErrors] = useState({});
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState("");

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const TAX_RATE = 0.13;
  const deliveryFee = totalPrice > 500 ? 0 : 49;
  const tax = +(totalPrice * TAX_RATE).toFixed(2);
  const grandTotal = +(totalPrice + deliveryFee + tax).toFixed(2);
  const grandTotalNPR = Math.round(grandTotal * 150);

  const handleShippingChange = (e) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  const validateShipping = () => {
    const errs = {};
    Object.entries(shipping).forEach(([k, v]) => {
      if (!v.trim()) errs[k] = "Required";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── COD / Wallet: place order directly ──────────────────────────────────
  const handlePlaceOrder = () => {
    const orderId = placeOrder({ cartItems, totalPrice, shippingInfo: shipping });
    clearCart();
    navigate("/order-success", { state: { orderId } });
  };

  // ── Stripe Card: redirect to Stripe Checkout ─────────────────────────────
  const handleStripeCheckout = async () => {
    setStripeLoading(true);
    setStripeError("");

    try {
      const stripe = await stripePromise;

      // Build line_items from cart
      const lineItems = cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          // Stripe uses cents
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      // Save a pending order before redirect (so we have it on return)
      const orderId = placeOrder({ cartItems, totalPrice, shippingInfo: shipping });

      const { error } = await stripe.redirectToCheckout({
        mode: "payment",
        lineItems,
        successUrl: `${window.location.origin}/order-success?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/checkout`,
        customerEmail: shipping.email || undefined,
        shippingAddressCollection: {
          allowedCountries: ["NP", "IN", "US", "GB"],
        },
        billingAddressCollection: "auto",
      });

      if (error) {
        setStripeError(error.message);
        setStripeLoading(false);
      } else {
        // On success Stripe redirects away, so clear cart after return
        clearCart();
      }
    } catch (err) {
      setStripeError("Something went wrong. Please try again.");
      setStripeLoading(false);
    }
  };

  const handleFinalAction = () => {
    if (payment.method === "card") {
      handleStripeCheckout();
    } else {
      handlePlaceOrder();
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Checkout</h2>

      {/* ── Step Indicator ── */}
      <div style={styles.steps}>
        {["Shipping", "Payment", "Review"].map((s, i) => (
          <div
            key={s}
            style={{
              ...styles.step,
              color: step === i + 1 ? "#6c47ff" : step > i + 1 ? "#22c55e" : "#aaa",
            }}
          >
            <div
              style={{
                ...styles.stepDot,
                backgroundColor:
                  step >= i + 1 ? (step > i + 1 ? "#22c55e" : "#6c47ff") : "#e5e5e5",
              }}
            >
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span style={styles.stepLabel}>{s}</span>
          </div>
        ))}
      </div>

      <div style={styles.body}>
        {/* ── LEFT: Forms ── */}
        <div style={styles.left}>

          {/* STEP 1: Shipping */}
          {step === 1 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Shipping Information</h3>
              <div style={styles.grid2}>
                {[
                  { name: "name", label: "Full Name", placeholder: "Prajwol Shrestha" },
                  { name: "email", label: "Email", placeholder: "prajwol@email.com", type: "email" },
                  { name: "phone", label: "Phone", placeholder: "+977 9826664694", type: "tel" },
                  { name: "pincode", label: "Pincode", placeholder: "44600" },
                ].map(({ name, label, placeholder, type = "text" }) => (
                  <div key={name}>
                    <label style={styles.label}>{label}</label>
                    <input
                      name={name}
                      type={type}
                      placeholder={placeholder}
                      value={shipping[name]}
                      onChange={handleShippingChange}
                      style={{ ...styles.input, borderColor: errors[name] ? "#e53e3e" : "#ddd" }}
                    />
                    {errors[name] && <span style={styles.fieldError}>Required</span>}
                  </div>
                ))}
              </div>
              <div>
                <label style={styles.label}>Address</label>
                <input
                  name="address"
                  placeholder="House no., Street, Area"
                  value={shipping.address}
                  onChange={handleShippingChange}
                  style={{ ...styles.input, borderColor: errors.address ? "#e53e3e" : "#ddd" }}
                />
                {errors.address && <span style={styles.fieldError}>Required</span>}
              </div>
              <div style={styles.grid2}>
                {[
                  { name: "city", label: "City", placeholder: "Kathmandu" },
                  { name: "state", label: "State", placeholder: "Bagmati" },
                ].map(({ name, label, placeholder }) => (
                  <div key={name}>
                    <label style={styles.label}>{label}</label>
                    <input
                      name={name}
                      placeholder={placeholder}
                      value={shipping[name]}
                      onChange={handleShippingChange}
                      style={{ ...styles.input, borderColor: errors[name] ? "#e53e3e" : "#ddd" }}
                    />
                    {errors[name] && <span style={styles.fieldError}>Required</span>}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { if (validateShipping()) setStep(2); }}
                style={styles.nextBtn}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Payment Method</h3>

              {[
                {
                  value: "cod",
                  label: "💵 Cash on Delivery",
                  desc: "Pay when your order arrives",
                },
                {
                  value: "wallet",
                  label: "📱 Digital Wallet",
                  desc: "Esewa, Khalti, NepalPay",
                },
                {
                  value: "card",
                  label: "💳 Credit / Debit Card",
                  desc: "Visa, Mastercard — secured by Stripe",
                  badge: "Stripe",
                },
              ].map(({ value, label, desc, badge }) => (
                <label
                  key={value}
                  style={{
                    ...styles.paymentOption,
                    borderColor: payment.method === value ? "#6c47ff" : "#ddd",
                    backgroundColor: payment.method === value ? "#f3f0ff" : "#fff",
                  }}
                >
                  <input
                    type="radio"
                    name="method"
                    value={value}
                    checked={payment.method === value}
                    onChange={() => setPayment({ method: value })}
                    style={{ accentColor: "#6c47ff" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={styles.payLabel}>{label}</div>
                    <div style={styles.payDesc}>{desc}</div>
                  </div>
                  {badge && (
                    <span style={styles.stripeBadge}>
                      <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
                        <rect width="40" height="16" rx="3" fill="#635BFF"/>
                        <text x="5" y="12" fontSize="9" fill="white" fontFamily="sans-serif" fontWeight="bold">stripe</text>
                      </svg>
                    </span>
                  )}
                </label>
              ))}

              {/* Stripe info box */}
              {payment.method === "card" && (
                <div style={styles.stripeInfo}>
                  <span style={styles.stripeInfoIcon}>🔒</span>
                  <span>
                    You'll be redirected to <strong>Stripe's secure checkout</strong> page to enter your card details. Your payment is encrypted and never stored on our servers.
                  </span>
                </div>
              )}

              <div style={styles.btnRow}>
                <button onClick={() => setStep(1)} style={styles.backBtn}>← Back</button>
                <button onClick={() => setStep(3)} style={styles.nextBtn}>Review Order →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Review Your Order</h3>

              <div style={styles.reviewSection}>
                <h4 style={styles.reviewHead}>📦 Shipping To</h4>
                <p style={styles.reviewText}>{shipping.name} | {shipping.phone}</p>
                <p style={styles.reviewText}>
                  {shipping.address}, {shipping.city}, {shipping.state} - {shipping.pincode}
                </p>
              </div>

              <div style={styles.reviewSection}>
                <h4 style={styles.reviewHead}>💳 Payment</h4>
                <p style={styles.reviewText}>
                  {payment.method === "cod"
                    ? "Cash on Delivery"
                    : payment.method === "wallet"
                    ? "Digital Wallet"
                    : "Credit / Debit Card (via Stripe)"}
                </p>
              </div>

              <div style={styles.reviewSection}>
                <h4 style={styles.reviewHead}>🛍️ Items ({cartItems.length})</h4>
                {cartItems.map((item) => (
                  <div key={item.id} style={styles.reviewItem}>
                    <span>{item.name.substring(0, 32)}…</span>
                    <span>×{item.quantity} = NPR {(item.price * 150 * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              {stripeError && (
                <div style={styles.errorBox}>⚠️ {stripeError}</div>
              )}

              <div style={styles.btnRow}>
                <button onClick={() => setStep(2)} style={styles.backBtn}>← Back</button>
                <button
                  onClick={handleFinalAction}
                  disabled={stripeLoading}
                  style={{
                    ...styles.nextBtn,
                    backgroundColor: payment.method === "card" ? "#635BFF" : "#22c55e",
                    opacity: stripeLoading ? 0.7 : 1,
                    cursor: stripeLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {stripeLoading ? (
                    <>
                      <span style={styles.spinner} /> Redirecting to Stripe…
                    </>
                  ) : payment.method === "card" ? (
                    "Pay with Stripe →"
                  ) : (
                    "✓ Place Order"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Order Summary ── */}
        <div style={styles.right}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Order Summary</h3>

            {cartItems.map((item) => (
              <div key={item.id} style={styles.summaryItem}>
                <img src={item.image} alt={item.name} style={styles.summaryImg} />
                <div style={{ flex: 1 }}>
                  <p style={styles.summaryName}>{item.name.substring(0, 25)}…</p>
                  <p style={styles.summaryQty}>Qty: {item.quantity}</p>
                </div>
                <span style={styles.summaryPrice}>
                  NPR {(item.price * 150 * item.quantity).toFixed(0)}
                </span>
              </div>
            ))}

            <div style={styles.divider} />
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>NPR {(totalPrice * 150).toFixed(0)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Delivery</span>
              <span>
                {deliveryFee === 0
                  ? <span style={{ color: "#22c55e", fontWeight: 600 }}>FREE</span>
                  : `NPR ${deliveryFee * 150}`}
              </span>
            </div>
            <div style={styles.summaryRow}>
              <span>Tax (13%)</span>
              <span>NPR {(tax * 150).toFixed(0)}</span>
            </div>
            <div style={styles.divider} />
            <div style={{ ...styles.summaryRow, fontWeight: "700", fontSize: "16px" }}>
              <span>Total</span>
              <span>NPR {grandTotalNPR}</span>
            </div>

            {deliveryFee === 0 && (
              <p style={styles.freeShip}>🎉 You qualify for free delivery!</p>
            )}

            {/* Stripe trust badge */}
            {payment.method === "card" && (
              <div style={styles.trustBadge}>
                <span>🔒</span> Payments secured by Stripe
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "1100px", margin: "0 auto" },
  heading: { fontSize: "24px", fontWeight: "700", marginBottom: "20px", textAlign: "left" },
  steps: { display: "flex", gap: "32px", marginBottom: "28px", alignItems: "center" },
  step: { display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600" },
  stepDot: { width: "28px", height: "28px", borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700" },
  stepLabel: {},
  body: { display: "flex", gap: "24px", alignItems: "flex-start" },
  left: { flex: 2 },
  right: { flex: 1, position: "sticky", top: "80px" },
  card: { backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "12px", padding: "24px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "14px" },
  cardTitle: { margin: 0, fontSize: "17px", fontWeight: "700" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#444", marginBottom: "4px" },
  input: { width: "100%", padding: "10px 12px", fontSize: "14px", border: "1px solid #ddd", borderRadius: "7px", outline: "none", boxSizing: "border-box" },
  fieldError: { color: "#e53e3e", fontSize: "11px" },
  nextBtn: { padding: "12px 20px", backgroundColor: "#6c47ff", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "14px" },
  backBtn: { padding: "12px 20px", backgroundColor: "#f0f0f0", color: "#333", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  btnRow: { display: "flex", gap: "12px" },
  paymentOption: { display: "flex", alignItems: "center", gap: "14px", padding: "14px", border: "2px solid #ddd", borderRadius: "10px", cursor: "pointer" },
  payLabel: { fontWeight: "600", fontSize: "14px" },
  payDesc: { fontSize: "12px", color: "#888", marginTop: "2px" },
  stripeBadge: { flexShrink: 0 },
  stripeInfo: { backgroundColor: "#f3f0ff", border: "1px solid #d4caff", borderRadius: "8px", padding: "12px 14px", fontSize: "13px", color: "#4a3f8f", display: "flex", gap: "10px", alignItems: "flex-start", lineHeight: "1.5" },
  stripeInfoIcon: { fontSize: "16px", flexShrink: 0 },
  reviewSection: { borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" },
  reviewHead: { margin: "0 0 6px", fontSize: "14px", fontWeight: "700", color: "#444" },
  reviewText: { margin: "0 0 4px", fontSize: "14px", color: "#555" },
  reviewItem: { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#555", margin: "4px 0" },
  errorBox: { backgroundColor: "#fff5f5", border: "1px solid #fed7d7", borderRadius: "8px", padding: "12px", fontSize: "13px", color: "#c53030" },
  spinner: { width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" },
  summaryItem: { display: "flex", alignItems: "center", gap: "10px" },
  summaryImg: { width: "44px", height: "44px", objectFit: "contain", borderRadius: "6px", backgroundColor: "#f5f5f5", padding: "4px" },
  summaryName: { margin: 0, fontSize: "12px", fontWeight: "500" },
  summaryQty: { margin: 0, fontSize: "11px", color: "#888" },
  summaryPrice: { fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" },
  divider: { borderTop: "1px solid #eee", margin: "4px 0" },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#444" },
  freeShip: { textAlign: "center", fontSize: "13px", color: "#22c55e", fontWeight: "600", margin: 0 },
  trustBadge: { textAlign: "center", fontSize: "12px", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", paddingTop: "4px" },
};

// Inject spinner keyframe
const styleEl = document.createElement("style");
styleEl.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleEl);

export default Checkout;