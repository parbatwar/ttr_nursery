import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import PlantImage from "./PlantImage";

// The most useful label comes first, and each card shows only one.
const LABELS = [
  ["sold_out", "Sold out"],
  ["sale", "Sale"],
  ["few_left", "Only a few left"],
  ["best_seller", "Best seller"],
  ["new", "New"],
];

function getLabel(product) {
  const match = LABELS.find(([key]) => product.labels?.includes(key));
  return match?.[1];
}

export default function ProductCard({ product, className = "" }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const productLink = `/products/${product.slug}`;
  const label = getLabel(product);
  const categoryNames = product.categories?.map((category) => category.name).join(" · ");
  const hasVariants = product.variants?.length > 0;
  const isSoldOut = product.labels?.includes("sold_out");
  const isOnSale = Number(product.original_price) > Number(product.price);

  const actionStyle =
    "absolute bottom-3.5 right-3.5 grid h-11 w-11 place-items-center rounded-full bg-[var(--ttr-green)] text-white transition hover:bg-[var(--ttr-green-dark)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-35";

  async function handleAdd() {
    setIsAdding(true);
    await addItem(product);
    setIsAdding(false);
  }

  return (
    <article
      className={`group relative rounded-[var(--ttr-radius-card)] bg-[var(--ttr-bg-soft)] p-1.5 pb-3.5 ${className}`}
    >
      <Link to={productLink} className="block rounded-[var(--ttr-radius-card)]">
        <div className="relative aspect-[1/1.08] overflow-hidden rounded-lg bg-[#e9e9e7]">
          {label && (
            <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-white px-3 py-1 text-[13px] font-medium">
              {label}
            </span>
          )}

          <PlantImage
            src={product.images?.[0]?.image}
            alt={product.name}
            className="ttr-photo h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="min-h-[86px] px-2 pr-14 pt-3">
          <h3 className="font-sans text-base font-medium leading-snug tracking-[-0.012em]">
            {product.name}
          </h3>

          <p className="mt-0.5 text-[15px] font-medium tabular-nums">
            {hasVariants ? "From " : ""}Rs. {Number(product.price).toLocaleString()}
            {isOnSale && (
              <span className="ml-2 font-normal text-[var(--ttr-text-muted)] line-through">
                Rs. {Number(product.original_price).toLocaleString()}
              </span>
            )}
          </p>

          <p className="mt-1 truncate text-[13px] text-[var(--ttr-text-muted)]">
            {categoryNames}
          </p>
        </div>
      </Link>

      {/* Products with sizes or colours need a choice first, on their own page. */}
      {hasVariants && !isSoldOut ? (
        <Link
          to={productLink}
          aria-label={`Choose options for ${product.name}`}
          className={actionStyle}
        >
          <ArrowRight size={19} strokeWidth={1.8} />
        </Link>
      ) : (
        <button
          type="button"
          disabled={isSoldOut || isAdding}
          onClick={handleAdd}
          aria-label={isSoldOut ? `${product.name} is sold out` : `Add ${product.name} to cart`}
          className={actionStyle}
        >
          <ShoppingBag size={19} strokeWidth={1.7} />
        </button>
      )}
    </article>
  );
}
