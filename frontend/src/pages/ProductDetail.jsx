import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../services/products";
import { addToCart } from "../services/cart";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProduct(slug);
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadProduct();
  }, [slug]);

  async function handleAddToCart() {
    const token = localStorage.getItem("access");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      await addToCart(product.id, 1);

      alert("Plant added to cart!");
      navigate("/cart");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--ttr-bg)]">
        <p className="text-sm text-[var(--ttr-text-soft)]">Loading...</p>
      </main>
    );
  }

  return (
    <main className="bg-[var(--ttr-bg)]">
      <section className="px-6 py-16 lg:px-16">
        <div className="mx-auto grid max-w-[var(--ttr-container)] gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="aspect-[4/5] overflow-hidden bg-[var(--ttr-bg-soft)]">
            <img
              src={product.images?.[0]?.image || "/placeholder.jpg"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--ttr-green)]">
              {product.category?.name}
            </p>

            <h1 className="mt-3 font-serif text-5xl leading-tight">
              {product.name}
            </h1>

            <p className="mt-5 text-2xl">
              Rs. {Number(product.price).toLocaleString()}
            </p>

            <p className="mt-8 text-sm leading-7 text-[var(--ttr-text-soft)]">
              {product.description}
            </p>

            {/* Plant Info */}
            <div className="mt-10 grid grid-cols-2 gap-5 border-y border-[var(--ttr-border-soft)] py-6">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--ttr-text-muted)]">
                  Sunlight
                </p>
                <p className="mt-2 capitalize">{product.sunlight}</p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--ttr-text-muted)]">
                  Watering
                </p>
                <p className="mt-2 capitalize">{product.watering}</p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--ttr-text-muted)]">
                  Stock
                </p>
                <p className="mt-2">{product.stock} available</p>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={loading || product.stock === 0}
              className="mt-10 w-full bg-[var(--ttr-green)] py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Adding..."
                : product.stock === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}