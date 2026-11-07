import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import PlantImage from "../components/PlantImage";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orders";

const CITIES = [
  { value: "kathmandu", name: "Kathmandu" },
  { value: "lalitpur", name: "Lalitpur" },
  { value: "bhaktapur", name: "Bhaktapur" },
];

const inputStyle =
  "w-full rounded-[var(--ttr-radius-control)] border border-[var(--ttr-border)] bg-white px-4 py-3.5 text-[15px] outline-none transition placeholder:text-[var(--ttr-text-muted)] focus:border-[var(--ttr-green)] focus:ring-2 focus:ring-[var(--ttr-green)]/15";

function formatPrice(value) {
  return `Rs. ${Number(value).toLocaleString()}`;
}

function FormSection({ title, children }) {
  return (
    <section className="mb-9">
      <h2 className="mb-4 text-[28px]">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function PaymentOption({ name, description, selected, disabled }) {
  return (
    <label
      className={`flex items-center gap-3 rounded-[var(--ttr-radius-control)] border p-4 ${
        selected ? "border-[var(--ttr-green)]" : "border-[var(--ttr-border)]"
      } ${disabled ? "opacity-50" : "cursor-pointer"}`}
    >
      <input
        type="radio"
        name="payment_method"
        checked={selected}
        disabled={disabled}
        readOnly
        className="h-4 w-4 accent-[var(--ttr-green)]"
      />
      <span>
        <span className="block font-medium">{name}</span>
        <span className="text-sm text-[var(--ttr-text-muted)]">{description}</span>
      </span>
    </label>
  );
}

function OrderSummary({ items, subtotal }) {
  return (
    <aside className="self-start rounded-[var(--ttr-radius-card)] bg-[var(--ttr-bg-soft)] p-5 lg:sticky lg:top-6 lg:p-6">
      <h2 className="mb-4 text-[28px]">Your order</h2>

      <div className="space-y-4">
        {items.map((item) => {
          const options = [item.variant?.size, item.variant?.color]
            .filter(Boolean)
            .join(" · ");

          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0">
                <div className="h-full w-full overflow-hidden rounded-xl bg-white">
                  <PlantImage
                    src={item.product.images?.[0]?.image}
                    alt={item.product.name}
                    className="ttr-photo h-full w-full object-cover"
                  />
                </div>
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--ttr-green)] px-1 text-xs font-semibold text-white">
                  {item.quantity}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium">{item.product.name}</p>
                {options && (
                  <p className="text-sm text-[var(--ttr-text-muted)]">{options}</p>
                )}
              </div>

              <p className="text-[15px] font-medium tabular-nums">
                {formatPrice(Number(item.unit_price) * item.quantity)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 space-y-2 border-t border-[var(--ttr-border)] pt-4 text-[15px]">
        <div className="flex justify-between">
          <span className="text-[var(--ttr-text-muted)]">Subtotal</span>
          <span className="tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--ttr-text-muted)]">Delivery</span>
          <span>We'll confirm with you</span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-[var(--ttr-border)] pt-4">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-semibold tracking-[-0.02em] tabular-nums">
          {formatPrice(subtotal)}
        </span>
      </div>
    </aside>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, isLoading, refreshCart } = useCart();

  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("kathmandu");
  const [errors, setErrors] = useState({});
  const [isPlacing, setIsPlacing] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setIsPlacing(true);

    try {
      const order = await createOrder({
        customer_name: customerName,
        email: email.trim(),
        phone: phone.trim(),
        address,
        city,
        note: note.trim(),
        payment_method: "cod",
      });

      await refreshCart();
      navigate(`/orders/${order.access_token}`, { replace: true });
    } catch (error) {
      setErrors({ ...error.fields, form: error.message });
      setIsPlacing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--ttr-bg)]">
      <header className="border-b border-[var(--ttr-border)]">
        <div className="mx-auto flex h-[72px] w-[calc(100%-32px)] max-w-[1080px] items-center justify-between">
          <Link to="/" aria-label="TTR Banglamukhi Nursery home">
            <img src="/logo-clean.png" alt="" className="h-14 w-auto" />
          </Link>

          <Link
            to="/products"
            className="inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-[var(--ttr-green)]"
          >
            <ArrowLeft size={17} />
            Continue shopping
          </Link>
        </div>
      </header>

      {isLoading ? (
        <p role="status" className="py-24 text-center text-[var(--ttr-text-soft)]">
          Loading your cart…
        </p>
      ) : items.length === 0 ? (
        <div className="px-4 py-24 text-center">
          <h1 className="text-5xl">Your cart is empty</h1>
          <p className="mt-3 text-[var(--ttr-text-soft)]">
            Add a plant, then come back to check out.
          </p>
          <Link to="/products" className="ttr-pill ttr-pill-dark mt-6">
            Shop plants
            <span className="ttr-pill-circle">→</span>
          </Link>
        </div>
      ) : (
        <main className="mx-auto grid w-[calc(100%-32px)] max-w-[1080px] gap-8 py-8 lg:grid-cols-[1fr_400px] lg:gap-14 lg:py-12">
          <div className="lg:order-2">
            <OrderSummary items={items} subtotal={subtotal} />
          </div>

          <form onSubmit={handleSubmit} className="lg:order-1">
            <h1 className="mb-1 text-5xl">Checkout</h1>
            <p className="mb-8 text-[var(--ttr-text-soft)]">
              No account needed. It only takes a minute.
            </p>

            <FormSection title="Contact">
              <Field label="Phone number" id="phone" error={errors.phone}>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                  required
                  className={inputStyle}
                />
              </Field>

              <Field label="Email" id="email" error={errors.email}>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  className={inputStyle}
                />
              </Field>
            </FormSection>

            <FormSection title="Delivery">
              <Field label="Full name" id="name" error={errors.customer_name}>
                <input
                  id="name"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  autoComplete="name"
                  required
                  className={inputStyle}
                />
              </Field>

              <Field label="Address" id="address" error={errors.address}>
                <input
                  id="address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  autoComplete="street-address"
                  placeholder="Area, street and nearby landmark"
                  required
                  className={inputStyle}
                />
              </Field>

              <Field label="City" id="city" error={errors.city}>
                <select
                  id="city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className={inputStyle}
                >
                  {CITIES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Order note (optional)" id="note" error={errors.note}>
                <textarea
                  id="note"
                  rows={3}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Anything we should know about your order or delivery"
                  className={inputStyle}
                />
              </Field>
            </FormSection>

            <FormSection title="Payment">
              <PaymentOption
                name="Cash on delivery"
                description="Pay when your plants arrive."
                selected
              />
              <PaymentOption
                name="eSewa"
                description="Coming soon"
                selected={false}
                disabled
              />
              <PaymentOption
                name="Khalti"
                description="Coming soon"
                selected={false}
                disabled
              />
            </FormSection>

            {errors.form && (
              <p
                role="alert"
                className="mb-4 rounded-[var(--ttr-radius-control)] bg-red-50 px-4 py-3 text-[15px] text-red-800"
              >
                {errors.form}
              </p>
            )}

            <button
              type="submit"
              disabled={isPlacing}
              className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[var(--ttr-green)] text-[17px] font-semibold text-white transition hover:bg-[var(--ttr-green-dark)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Lock size={16} />
              {isPlacing ? "Placing your order…" : `Place order · ${formatPrice(subtotal)}`}
            </button>
          </form>
        </main>
      )}
    </div>
  );
}
