import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Check, Minus, Plus, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import PlantImage from "./PlantImage";

function formatPrice(value) {
  return `Rs. ${Number(value).toLocaleString()}`;
}

function CartLine({ item, onChangeQuantity, onRemove }) {
  const { product, variant, quantity, unit_price: unitPrice } = item;
  const options = [variant?.size, variant?.color].filter(Boolean).join(" · ");

  return (
    <div className="grid grid-cols-[88px_1fr_auto] gap-3.5 border-b border-[var(--ttr-border)] py-3.5">
      <div className="h-24 overflow-hidden rounded-[14px] bg-[var(--ttr-bg-soft)]">
        <PlantImage
          src={product.images?.[0]?.image}
          alt={product.name}
          className="ttr-photo h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0">
        <h3 className="font-sans text-base font-semibold tracking-[-0.012em]">
          {product.name}
        </h3>

        {options && (
          <p className="text-sm text-[var(--ttr-text-muted)]">{options}</p>
        )}

        <div className="mt-2 inline-flex items-center rounded-[10px] border border-[var(--ttr-border)]">
          <button
            type="button"
            aria-label={`Reduce quantity of ${product.name}`}
            disabled={quantity <= 1}
            onClick={() => onChangeQuantity(item.id, quantity - 1)}
            className="grid h-9 w-9 place-items-center disabled:opacity-30"
          >
            <Minus size={15} />
          </button>

          <span className="w-7 text-center text-sm font-medium">{quantity}</span>

          <button
            type="button"
            aria-label={`Increase quantity of ${product.name}`}
            onClick={() => onChangeQuantity(item.id, quantity + 1)}
            className="grid h-9 w-9 place-items-center"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <b className="font-semibold tabular-nums">
          {formatPrice(Number(unitPrice) * quantity)}
        </b>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="min-h-9 text-sm text-[var(--ttr-text-muted)] underline underline-offset-4"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const {
    items,
    subtotal,
    isOpen,
    notice,
    error,
    closeCart,
    changeQuantity,
    removeItem,
  } = useCart();

  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleEscape(event) {
      if (event.key === "Escape") closeCart();
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  return (
    <div
      inert={!isOpen}
      className={`fixed inset-0 z-[60] transition-[visibility] duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div
        aria-hidden="true"
        onClick={closeCart}
        className={`absolute inset-0 bg-[#18231b]/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`absolute inset-y-0 right-0 flex w-[calc(100%-28px)] max-w-[440px] flex-col bg-white p-5 shadow-[-18px_0_48px_rgba(24,35,27,0.2)] transition-transform duration-300 ease-out sm:p-6 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[34px]">Your cart</h2>

          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-[var(--ttr-bg-soft)]"
          >
            <X size={21} strokeWidth={1.7} />
          </button>
        </div>

        {notice && (
          <p
            role="status"
            className="mb-2 flex items-center gap-2 rounded-[var(--ttr-radius-control)] bg-[#dfeade] px-3.5 py-2.5 text-[15px] font-medium"
          >
            <Check size={16} />
            {notice}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mb-2 rounded-[var(--ttr-radius-control)] bg-red-50 px-3.5 py-2.5 text-[15px] text-red-800"
          >
            {error}
          </p>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[var(--ttr-text-soft)]">Your cart is empty.</p>
              <Link
                to="/products"
                onClick={closeCart}
                className="mt-4 inline-flex min-h-11 items-center font-semibold text-[var(--ttr-green)]"
              >
                Shop plants ›
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <CartLine
                key={item.id}
                item={item}
                onChangeQuantity={changeQuantity}
                onRemove={removeItem}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-4">
            <div className="flex justify-between text-xl font-semibold tracking-[-0.02em]">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>

            <Link
              to="/checkout"
              onClick={closeCart}
              className="mt-4 flex min-h-[54px] w-full items-center justify-center rounded-full bg-[var(--ttr-green)] font-semibold text-white transition hover:bg-[var(--ttr-green-dark)]"
            >
              Checkout
            </Link>

            <button
              type="button"
              onClick={closeCart}
              className="mt-1 min-h-11 w-full font-semibold text-[var(--ttr-green)]"
            >
              Keep shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
