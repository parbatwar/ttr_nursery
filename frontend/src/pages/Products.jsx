import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts, getCategories } from "../services/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [ordering, setOrdering] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [search, category, ordering]);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  async function loadProducts() {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (ordering) params.append("ordering", ordering);

    const data = await getProducts(params.toString());
    setProducts(data.results);
  }

  return (
    <main className="bg-[var(--ttr-bg)] min-h-screen">
      <section className="px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-[var(--ttr-container)]">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--ttr-green)] mb-4">
            Collection
          </p>

          <h1 className="font-serif text-5xl">All Plants</h1>

          {/* Filters */}
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Search plants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-[var(--ttr-border)] bg-white px-4 py-3 outline-none"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-[var(--ttr-border)] bg-white px-4 py-3 outline-none"
            >
              <option value="">All Categories</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className="border border-[var(--ttr-border)] bg-white px-4 py-3 outline-none"
            >
              <option value="">Sort</option>
              <option value="price">Price: Low → High</option>
              <option value="-price">Price: High → Low</option>
              <option value="name">Name A–Z</option>
              <option value="-created_at">Newest</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <p className="mt-20 text-center text-[var(--ttr-text-muted)]">
              No plants found.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}