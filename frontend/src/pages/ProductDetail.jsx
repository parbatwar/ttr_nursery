import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../services/products";
import { useCart } from "../context/CartContext";
import PlantImage from "../components/PlantImage";

function getTags(product) {
  const tags = [];

  if (product.care_level_label) tags.push(`${product.care_level_label} care`);
  product.light_requirements?.forEach((light) => tags.push(light.name));
  if (product.watering_label) tags.push(`Water: ${product.watering_label.toLowerCase()}`);
  if (product.lifespan_label) tags.push(product.lifespan_label);
  if (product.is_flowering) tags.push("Flowering");
  if (product.item_type_label) tags.push(product.item_type_label);
  if (product.comes_in_label) tags.push(`Comes in a ${product.comes_in_label.toLowerCase()}`);
  if (product.best_season) tags.push(`Best season: ${product.best_season}`);

  return tags;
}

function ProductContent({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const variants = product.variants || [];
  const [variantId, setVariantId] = useState(
    () => (variants.find((item) => item.stock > 0) || variants[0])?.id,
  );
  const [imageIndex, setImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const selected = variants.find((item) => item.id === variantId);
  const price = selected?.price ?? product.price;
  const stock = selected?.stock ?? product.stock;
  const originalPrice = selected ? selected.original_price : product.original_price;
  const isOnSale = Number(originalPrice) > Number(price);
  const potSize = selected ? selected.pot_size : product.pot_size;
  const sizeName = selected?.size || product.size_label;

  const sizes = [...new Set(variants.map((item) => item.size))];
  const colors = [...new Set(variants.map((item) => item.color))];
  const showSize = sizes.some(Boolean);
  const showColor = colors.some(Boolean);
  const images = product.images || [];
  const tags = getTags(product);
  const cannotBuy = isAdding || stock <= 0 || (variants.length > 0 && !selected);

  function chooseSize(size) {
    const matches = variants.filter((item) => item.size === size);
    const next =
      matches.find((item) => item.color === selected?.color && item.stock > 0) ||
      matches.find((item) => item.stock > 0) ||
      matches[0];

    setVariantId(next.id);
  }

  async function handleAddToCart() {
    setIsAdding(true);
    await addItem(product, selected?.id ?? null);
    setIsAdding(false);
  }

  async function handleBuyNow() {
    setIsAdding(true);
    const added = await addItem(product, selected?.id ?? null, { openDrawer: false });
    setIsAdding(false);

    if (added) navigate("/checkout");
  }

  function optionStyle(isActive) {
    return `min-h-11 rounded-full border px-5 text-[15px] font-medium transition disabled:cursor-not-allowed disabled:opacity-35 ${
      isActive
        ? "border-[var(--ttr-green)] bg-[var(--ttr-green)] text-white"
        : "border-[var(--ttr-border)] hover:border-[var(--ttr-text)]"
    }`;
  }

  return (
    <section className="mx-auto w-[calc(100%-32px)] max-w-[var(--ttr-container)] py-8 lg:w-[calc(100%-64px)] lg:py-12">
      <Link
        to="/products"
        className="inline-flex min-h-11 items-center text-[15px] font-medium text-[var(--ttr-green)]"
      >
        ‹ Back to products
      </Link>

      <div className="mt-4 grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-xl bg-[var(--ttr-bg-soft)]">
            <PlantImage
              src={images[imageIndex]?.image}
              alt={product.name}
              className="ttr-photo h-full w-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto" aria-label="Product images">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={imageIndex === index}
                  onClick={() => setImageIndex(index)}
                  className={`h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                    imageIndex === index
                      ? "border-[var(--ttr-text)]"
                      : "border-transparent"
                  }`}
                >
                  <PlantImage
                    src={image.image}
                    alt={`${product.name}, image ${index + 1}`}
                    className="ttr-photo h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24">
          <p className="text-sm font-medium text-[var(--ttr-text-muted)]">
            {product.categories?.map((item) => item.name).join(" · ")}
          </p>

          <h1 className="mt-2 text-5xl lg:text-6xl">{product.name}</h1>

          {product.local_name && (
            <p className="mt-2 text-[var(--ttr-text-muted)]">{product.local_name}</p>
          )}

          <p className="mt-4 text-2xl font-medium tabular-nums" aria-live="polite">
            Rs. {Number(price).toLocaleString()}
            {isOnSale && (
              <span className="ml-3 text-lg font-normal text-[var(--ttr-text-muted)] line-through">
                Rs. {Number(originalPrice).toLocaleString()}
              </span>
            )}
          </p>

          {tags.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Product details">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-[var(--ttr-bg-soft)] px-3.5 py-1.5 text-sm font-medium"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          {showSize && (
            <fieldset className="mt-7">
              <legend className="mb-2.5 text-sm font-semibold">Size</legend>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selected?.size === size}
                    onClick={() => chooseSize(size)}
                    className={optionStyle(selected?.size === size)}
                  >
                    {size || "Standard"}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {showColor && (
            <fieldset className="mt-5">
              <legend className="mb-2.5 text-sm font-semibold">Color</legend>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const match = variants.find(
                    (item) =>
                      item.color === color && item.size === (selected?.size || ""),
                  );

                  return (
                    <button
                      key={color}
                      type="button"
                      disabled={!match}
                      aria-pressed={selected?.color === color}
                      onClick={() => setVariantId(match.id)}
                      className={optionStyle(selected?.color === color)}
                    >
                      {color || "Standard"}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {(potSize || (sizeName && !showSize)) && (
            <dl className="mt-6 flex gap-10 border-y border-[var(--ttr-border)] py-4">
              {sizeName && !showSize && (
                <div>
                  <dt className="text-sm text-[var(--ttr-text-muted)]">Size</dt>
                  <dd className="mt-0.5 font-medium">{sizeName}</dd>
                </div>
              )}
              {potSize && (
                <div>
                  <dt className="text-sm text-[var(--ttr-text-muted)]">Pot size</dt>
                  <dd className="mt-0.5 font-medium">{potSize}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-5 min-h-6" aria-live="polite">
            {stock <= 0 ? (
              <p className="text-[15px] text-[var(--ttr-text-muted)]">Currently out of stock</p>
            ) : stock < product.low_stock_threshold ? (
              <p className="text-[15px] font-medium text-[var(--ttr-green)]">
                Only {stock} left
              </p>
            ) : null}
          </div>

          <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={cannotBuy}
              className="min-h-[54px] rounded-full border border-[var(--ttr-text)] font-semibold transition hover:bg-[var(--ttr-bg-soft)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {stock <= 0 ? "Out of stock" : "Add to cart"}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={cannotBuy}
              className="min-h-[54px] rounded-full bg-[var(--ttr-green)] font-semibold text-white transition hover:bg-[var(--ttr-green-dark)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy it now
            </button>
          </div>

          {product.description && (
            <div className="mt-8 border-t border-[var(--ttr-border)] pt-6">
              <h2 className="text-[28px]">About this plant</h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-[var(--ttr-text-soft)]">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [result, setResult] = useState(null);
  const [retry, setRetry] = useState(0);
  const key = `${slug}:${retry}`;

  useEffect(() => {
    const controller = new AbortController();

    getProduct(slug, { signal: controller.signal })
      .then((product) => {
        if (!controller.signal.aborted) setResult({ key, product });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setResult({ key, error: error.message });
      });

    return () => controller.abort();
  }, [slug, key]);

  if (result?.key !== key) {
    return (
      <p role="status" className="px-6 py-24 text-center">
        Loading plant…
      </p>
    );
  }

  if (result.error) {
    return (
      <div role="alert" className="px-6 py-24 text-center">
        <p>{result.error}</p>
        <button
          onClick={() => setRetry((value) => value + 1)}
          className="mt-5 min-h-11 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return <ProductContent key={key} product={result.product} />;
}
