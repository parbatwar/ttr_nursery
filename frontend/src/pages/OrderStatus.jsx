import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { getOrderStatus } from "../services/orders";

function formatPrice(value) {
  return `Rs. ${Number(value).toLocaleString()}`;
}

function DetailBlock({ title, children }) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-[var(--ttr-text-muted)]">{title}</p>
      <div className="text-[15px] leading-6">{children}</div>
    </div>
  );
}

export default function OrderStatus() {
  const { accessToken } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    getOrderStatus(accessToken, { signal: controller.signal })
      .then((order) => {
        if (!controller.signal.aborted) setResult({ order });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setResult({ error: error.message });
      });

    return () => controller.abort();
  }, [accessToken]);

  if (!result) {
    return (
      <p role="status" className="py-24 text-center text-[var(--ttr-text-soft)]">
        Loading your order…
      </p>
    );
  }

  if (result.error) {
    return (
      <div role="alert" className="px-4 py-24 text-center">
        <h1 className="text-5xl">We couldn't find this order</h1>
        <p className="mt-3 text-[var(--ttr-text-soft)]">{result.error}</p>
      </div>
    );
  }

  const { order } = result;

  return (
    <div className="mx-auto w-[calc(100%-32px)] max-w-[720px] py-12 lg:py-20">
      <div className="mb-10 text-center">
        <CheckCircle2
          size={44}
          strokeWidth={1.4}
          className="mx-auto mb-4 text-[var(--ttr-green)]"
        />
        <h1 className="text-5xl lg:text-6xl">
          Thank you, <em>{order.customer_name.split(" ")[0]}.</em>
        </h1>
        <p className="mt-3 text-[var(--ttr-text-soft)]">
          Order #{order.id} is placed. We'll contact you to confirm delivery.
        </p>
      </div>

      <div className="rounded-[var(--ttr-radius-card)] bg-[var(--ttr-bg-soft)] p-5 lg:p-7">
        <div className="space-y-3 border-b border-[var(--ttr-border)] pb-5">
          {order.items.map((item) => {
            const options = [item.variant_size, item.variant_color]
              .filter(Boolean)
              .join(" · ");

            return (
              <div key={item.id} className="flex justify-between gap-4 text-[15px]">
                <span>
                  {item.product_name} × {item.quantity}
                  {options && (
                    <span className="block text-sm text-[var(--ttr-text-muted)]">
                      {options}
                    </span>
                  )}
                </span>
                <span className="tabular-nums">{formatPrice(item.subtotal)}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-baseline justify-between py-5">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-semibold tracking-[-0.02em] tabular-nums">
            {formatPrice(order.total)}
          </span>
        </div>

        <div className="grid gap-5 border-t border-[var(--ttr-border)] pt-5 sm:grid-cols-3">
          <DetailBlock title="Contact">
            {order.email && <p>{order.email}</p>}
            {order.phone && <p>{order.phone}</p>}
          </DetailBlock>

          <DetailBlock title="Delivery to">
            <p>{order.customer_name}</p>
            <p>{order.address}</p>
            <p className="capitalize">{order.city}</p>
          </DetailBlock>

          <DetailBlock title="Payment">
            <p>{order.payment_method_label}</p>
            <p className="text-[var(--ttr-text-muted)]">Status: {order.status_label}</p>
          </DetailBlock>
        </div>

        {order.note && (
          <div className="mt-5 border-t border-[var(--ttr-border)] pt-5">
            <DetailBlock title="Your note">
              <p className="whitespace-pre-line">{order.note}</p>
            </DetailBlock>
          </div>
        )}
      </div>

      <p className="mt-5 text-center text-sm text-[var(--ttr-text-muted)]">
        Save this page's link to check your order later.
      </p>

      <div className="mt-6 text-center">
        <Link to="/products" className="ttr-pill ttr-pill-dark">
          Continue shopping
          <span className="ttr-pill-circle">→</span>
        </Link>
      </div>
    </div>
  );
}
