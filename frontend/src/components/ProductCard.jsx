import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const image =
    product.images?.[0]?.image || "/placeholder.jpg";

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block"
    >
      <div className="aspect-[4/5] overflow-hidden bg-[var(--ttr-bg-soft)]">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-4">
        <p className="text-[9px] uppercase tracking-[0.22em] text-[var(--ttr-text-muted)]">
          {product.category?.name}
        </p>

        <div className="mt-2 flex items-start justify-between gap-4">
          <h3 className="font-serif text-lg leading-tight">
            {product.name}
          </h3>

          <p className="shrink-0 text-xs text-[var(--ttr-text-soft)]">
            Rs. {Number(product.price).toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}