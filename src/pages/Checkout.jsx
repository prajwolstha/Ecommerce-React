import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useOrders } from "../context/OrderContext.jsx";

function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: shipping, 2: payment, 3: review
  const [shipping, setShipping] = useState({
    name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
  });
  const [payment, setPayment] = useState({ method: "cod" });
  const [errors, setErrors] = useState({});

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

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

  const handlePlaceOrder = () => {
    const orderId = placeOrder({ cartItems, totalPrice, shippingInfo: shipping });
    clearCart();
    navigate("/order-success", { state: { orderId } });
  };

  const deliveryFee = totalPrice > 500 ? 0 : 49;
  const tax = +(totalPrice * 0.18).toFixed(2);
  const grandTotal = +(totalPrice + deliveryFee + tax).toFixed(2);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Checkout</h2>

      {/* Steps */}
      <div style={styles.steps}>
        {["Shipping", "Payment", "Review"].map((s, i) => (
          <div key={s} style={{ ...styles.step, color: step === i + 1 ? "#6c47ff" : step > i + 1 ? "#22c55e" : "#aaa" }}>
            <div style={{
              ...styles.stepDot,
              backgroundColor: step >= i + 1 ? (step > i + 1 ? "#22c55e" : "#6c47ff") : "#e5e5e5",
            }}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span style={styles.stepLabel}>{s}</span>
          </div>
        ))}
      </div>

      <div style={styles.body}>
        {/* Left: Forms */}
        <div style={styles.left}>

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Shipping Information</h3>
              <div style={styles.grid2}>
                {[
                  { name: "name", label: "Full Name", placeholder: "Prajwol shrestha" },
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
                  { name: "city", label: "City", placeholder: "Kathamandu" },
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
              <button onClick={() => { if (validateShipping()) setStep(2); }} style={styles.nextBtn}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Payment Method</h3>
              {[
                { value: "cod", label: "💵 Cash on Delivery", desc: "Pay when your order arrives" },
                { value: "upi", label: "📱 UPI", desc: "Google Pay, PhonePe, Paytm" },
                { value: "card", label: "💳 Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
              ].map(({ value, label, desc }) => (
                <label key={value} style={{
                  ...styles.paymentOption,
                  borderColor: payment.method === value ? "#6c47ff" : "#ddd",
                  backgroundColor: payment.method === value ? "#f3f0ff" : "#fff",
                }}>
                  <input
                    type="radio"
                    name="method"
                    value={value}
                    checked={payment.method === value}
                    onChange={() => setPayment({ method: value })}
                    style={{ accentColor: "#6c47ff" }}
                  />
                  <div>
                    <div style={styles.payLabel}>{label}</div>
                    <div style={styles.payDesc}>{desc}</div>
                  </div>
                </label>
              ))}
              <div style={styles.btnRow}>
                <button onClick={() => setStep(1)} style={styles.backBtn}>← Back</button>
                <button onClick={() => setStep(3)} style={styles.nextBtn}>Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Review Your Order</h3>
              <div style={styles.reviewSection}>
                <h4 style={styles.reviewHead}>📦 Shipping To</h4>
                <p style={styles.reviewText}>{shipping.name} | {shipping.phone}</p>
                <p style={styles.reviewText}>{shipping.address}, {shipping.city}, {shipping.state} - {shipping.pincode}</p>
              </div>
              <div style={styles.reviewSection}>
                <h4 style={styles.reviewHead}>💳 Payment</h4>
                <p style={styles.reviewText}>
                  {payment.method === "cod" ? "Cash on Delivery" : payment.method === "upi" ? "UPI" : "Credit/Debit Card"}
                </p>
              </div>
              <div style={styles.reviewSection}>
                <h4 style={styles.reviewHead}>🛍️ Items ({cartItems.length})</h4>
                {cartItems.map((item) => (
                  <div key={item.id} style={styles.reviewItem}>
                    <span>{item.name.substring(0, 30)}...</span>
                    <span>×{item.quantity} = NPR{(item.price * 83 * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div style={styles.btnRow}>
                <button onClick={() => setStep(2)} style={styles.backBtn}>← Back</button>
                <button onClick={handlePlaceOrder} style={{ ...styles.nextBtn, backgroundColor: "#22c55e" }}>
                  ✓ Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div style={styles.right}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item.id} style={styles.summaryItem}>
                <img src={item.image} alt={item.name} style={styles.summaryImg} />
                <div style={{ flex: 1 }}>
                  <p style={styles.summaryName}>{item.name.substring(0, 25)}...</p>
                  <p style={styles.summaryQty}>Qty: {item.quantity}</p>
                </div>
                <span style={styles.summaryPrice}>NPR{(item.price * 83 * item.quantity).toFixed(0)}</span>
              </div>
            ))}
            <div style={styles.divider} />
            <div style={styles.summaryRow}><span>Subtotal</span><span>NPR{(totalPrice * 83).toFixed(0)}</span></div>
            <div style={styles.summaryRow}><span>Delivery</span><span>{deliveryFee === 0 ? <span style={{ color: "#22c55e" }}>FREE</span> : `NPR${deliveryFee * 83}`}</span></div>
            <div style={styles.summaryRow}><span>GST (18%)</span><span>NPR{(tax * 83).toFixed(0)}</span></div>
            <div style={styles.divider} />
            <div style={{ ...styles.summaryRow, fontWeight: "700", fontSize: "16px" }}>
              <span>Total</span>
              <span>NPR{(grandTotal * 83).toFixed(0)}</span>
            </div>
            {deliveryFee === 0 && (
              <p style={styles.freeShip}>🎉 You qualify for free delivery!</p>
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
  reviewSection: { borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" },
  reviewHead: { margin: "0 0 6px", fontSize: "14px", fontWeight: "700", color: "#444" },
  reviewText: { margin: "0 0 4px", fontSize: "14px", color: "#555" },
  reviewItem: { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#555", margin: "4px 0" },
  summaryItem: { display: "flex", alignItems: "center", gap: "10px" },
  summaryImg: { width: "44px", height: "44px", objectFit: "contain", borderRadius: "6px", backgroundColor: "#f5f5f5", padding: "4px" },
  summaryName: { margin: 0, fontSize: "12px", fontWeight: "500" },
  summaryQty: { margin: 0, fontSize: "11px", color: "#888" },
  summaryPrice: { fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" },
  divider: { borderTop: "1px solid #eee", margin: "4px 0" },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#444" },
  freeShip: { textAlign: "center", fontSize: "13px", color: "#22c55e", fontWeight: "600", margin: 0 },
};

export default Checkout;