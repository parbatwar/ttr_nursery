import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { getCatalogFilters, getProducts } from "../services/products";

const EMPTY_CATALOG = {
  categories: [],
  care_levels: [],
  light_requirements: [],
  lifespans: [],
  sizes: [],
  item_types: [],
};

const OLD_CATEGORY_LINKS = {
  "indoor-plant": "indoor",
  "indoor-plants": "indoor",
  "outdoor-plant": "outdoor",
  "outdoor-plants": "outdoor",
};

const CATEGORY_INTROS = {
  indoor: "Find plants for your home, your light, and your everyday life.",
  outdoor: "Find something to grow in your garden, balcony, or outdoor space.",
  "fruit-herbs": "Grow something you can pick, cook with, and enjoy.",
  "pots-garden-care": "Pots, soil, fertilizer, and tools to keep your plants thriving.",
};

// Which filters each category shows, in the order they appear.
const PLANT_FILTERS = ["care_level", "light", "size", "flowering", "lifespan"];
const CATEGORY_FILTERS = {
  indoor: PLANT_FILTERS,
  outdoor: PLANT_FILTERS,
  "fruit-herbs": ["item_type", "care_level", "light", "size"],
  "pots-garden-care": ["item_type", "size"],
};

const ITEM_TYPES_BY_CATEGORY = {
  "fruit-herbs": ["fruit", "herb"],
  "pots-garden-care": ["pots", "soil-fertilizer", "tools"],
};

const FILTER_TITLES = {
  item_type: "Type",
  care_level: "Care level",
  light: "Light",
  size: "Size",
};

const ALL_FILTER_KEYS = [
  "category",
  "item_type",
  "care_level",
  "light",
  "lifespan",
  "flowering",
  "size",
  "search",
];

const inputStyle =
  "w-full rounded-lg border border-[var(--ttr-border)] bg-white px-3 py-3 text-sm outline-none focus:border-[var(--ttr-green)] focus:ring-2 focus:ring-[var(--ttr-green)]/15";

function selectedValues(params, key) {
  const values = params.getAll(key).flatMap((value) => value.split(","));
  return [...new Set(values.filter(Boolean))];
}

function getFilterOptions(key, catalog, category) {
  if (key === "care_level") return catalog.care_levels;
  if (key === "light") return catalog.light_requirements;
  if (key === "lifespan") return catalog.lifespans;
  if (key === "size") return catalog.sizes;

  if (key === "item_type") {
    const allowed = ITEM_TYPES_BY_CATEGORY[category] || [];
    return catalog.item_types.filter((option) => allowed.includes(option.slug));
  }

  return [];
}

function getActiveFilterLabel(key, value, catalog, categoryName) {
  if (key === "category") return categoryName || value;
  if (key === "flowering") return "Flowering";
  if (key === "search") return `Search: ${value}`;

  const option = getFilterOptions(key, catalog, null).find(
    (item) => item.slug === value,
  );
  const itemType = catalog.item_types.find((item) => item.slug === value);

  return option?.name || itemType?.name || value;
}

function CheckboxFilter({ title, filterKey, options, params, onChange }) {
  const selected = selectedValues(params, filterKey);

  function toggleOption(slug) {
    const next = selected.includes(slug)
      ? selected.filter((value) => value !== slug)
      : [...selected, slug];

    onChange({ [filterKey]: next.join(",") });
  }

  return (
    <details
      className="border-b border-[var(--ttr-border)] py-4"
      open={selected.length > 0 || undefined}
    >
      <summary className="cursor-pointer text-sm font-medium">{title}</summary>

      <fieldset className="mt-5 space-y-3">
        <legend className="sr-only">{title}</legend>

        {options.map((option) => (
          <label
            key={option.slug}
            className="flex cursor-pointer items-center gap-3 text-sm text-[var(--ttr-text-soft)]"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.slug)}
              onChange={() => toggleOption(option.slug)}
              className="h-4 w-4 accent-[var(--ttr-green)]"
            />
            {option.name}
          </label>
        ))}
      </fieldset>
    </details>
  );
}

function OpenCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center gap-3 border-b border-[var(--ttr-border)] text-sm font-medium">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[var(--ttr-green)]"
      />
      {label}
    </label>
  );
}

function CategoryFilter({ categories, selected, onChoose }) {
  const options = [{ slug: "", name: "All products" }, ...categories];

  return (
    <fieldset className="border-b border-[var(--ttr-border)] pb-4">
      <legend className="mb-3 text-sm font-medium">Category</legend>

      <div className="space-y-1">
        {options.map((option) => (
          <label
            key={option.slug || "all"}
            className="flex min-h-9 cursor-pointer items-center gap-3 text-sm text-[var(--ttr-text-soft)]"
          >
            <input
              type="radio"
              name="category"
              checked={selected === option.slug}
              onChange={() => onChoose(option.slug)}
              className="h-4 w-4 accent-[var(--ttr-green)]"
            />
            {option.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function FilterFields({
  params,
  catalog,
  category,
  loadError,
  onChange,
  onChooseCategory,
  onRetry,
}) {
  const filterKeys = CATEGORY_FILTERS[category] || PLANT_FILTERS;

  const selectedLifespans = selectedValues(params, "lifespan");

  function toggleLifespan(slug, isChecked) {
    const next = isChecked
      ? [...selectedLifespans, slug]
      : selectedLifespans.filter((value) => value !== slug);

    onChange({ lifespan: next.join(",") });
  }

  return (
    <>
      {loadError && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          Filters could not load.{" "}
          <button type="button" onClick={onRetry} className="underline">
            Retry
          </button>
        </p>
      )}

      <CategoryFilter
        categories={catalog.categories}
        selected={category}
        onChoose={onChooseCategory}
      />

      {filterKeys.map((key) => {
        if (key === "flowering") {
          return (
            <OpenCheckbox
              key={key}
              label="Flowering"
              checked={params.get("flowering") === "true"}
              onChange={(isChecked) => onChange({ flowering: isChecked ? "true" : "" })}
            />
          );
        }

        // Seasonal and Perennial stay open, without a dropdown.
        if (key === "lifespan") {
          return catalog.lifespans.map((option) => (
            <OpenCheckbox
              key={option.slug}
              label={option.name}
              checked={selectedLifespans.includes(option.slug)}
              onChange={(isChecked) => toggleLifespan(option.slug, isChecked)}
            />
          ));
        }

        return (
          <CheckboxFilter
            key={key}
            title={FILTER_TITLES[key]}
            filterKey={key}
            options={getFilterOptions(key, catalog, category)}
            params={params}
            onChange={onChange}
          />
        );
      })}
    </>
  );
}

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [catalog, setCatalog] = useState(EMPTY_CATALOG);
  const [catalogError, setCatalogError] = useState(false);
  const [catalogRetry, setCatalogRetry] = useState(0);
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const query = params.toString();
  const requestKey = `${query}:${retry}`;
  const pending = result?.key !== requestKey;
  const rawCategory = params.get("category") || "";
  const category = OLD_CATEGORY_LINKS[rawCategory] || rawCategory;
  const selectedCategory = catalog.categories.find((item) => item.slug === category);
  const page = Math.max(1, Number(params.get("page")) || 1);
  const activeFilters = ALL_FILTER_KEYS.flatMap((key) =>
    selectedValues(params, key).map((value) => ({ key, value })),
  );

  function changeFilters(changes) {
    setParams((current) => {
      const next = new URLSearchParams(current);

      next.delete("page");
      Object.entries(changes).forEach(([key, value]) => {
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
      });

      return next;
    });
  }

  function chooseCategory(slug) {
    // Each category has its own filters, so start again when switching.
    setParams(slug ? { category: slug } : {});
  }

  useEffect(() => {
    const controller = new AbortController();

    getCatalogFilters({ signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setCatalog(data);
        setCatalogError(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setCatalogError(true);
      });

    return () => controller.abort();
  }, [catalogRetry]);

  useEffect(() => {
    const controller = new AbortController();
    const filters = new URLSearchParams(query);

    if (!filters.has("ordering")) filters.set("ordering", "-created_at");

    getProducts(filters.toString(), { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setResult({ key: requestKey, data });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setResult({ key: requestKey, error: error.message });
        }
      });

    return () => controller.abort();
  }, [query, requestKey]);

  function goToPage(nextPage) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.set("page", String(nextPage));
      return next;
    });

    document
      .getElementById("catalog-results")
      ?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function removeFilter(key, value) {
    const remaining = selectedValues(params, key).filter((item) => item !== value);
    changeFilters({ [key]: remaining.join(",") });
  }

  return (
    <section className="min-h-screen bg-[var(--ttr-bg)] px-5 py-10 sm:px-10 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-[var(--ttr-container)]">
        <div className="border-b border-[var(--ttr-border-soft)] pb-9">
          <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[var(--ttr-green)]">
            Explore the nursery
          </p>
          <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
            {selectedCategory?.name || (category ? "Browse products" : "All products")}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--ttr-text-soft)]">
            {CATEGORY_INTROS[category] ||
              "Start with your space. Find plants that suit the way you live."}
          </p>
        </div>

        <div className="mt-9 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10">
          <aside
            aria-label="Product filters"
            className="self-start rounded-xl border border-[var(--ttr-border)] bg-[var(--ttr-bg-soft)]/50 p-5 lg:sticky lg:top-24 lg:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-sans text-sm font-semibold tracking-normal">
                <SlidersHorizontal size={17} />
                Filters{" "}
                {activeFilters.length > 0 && (
                  <span className="text-[var(--ttr-green)]">
                    ({activeFilters.length})
                  </span>
                )}
              </h2>

              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-expanded={mobileOpen}
                aria-controls="filter-fields"
                className="text-xs underline underline-offset-4 lg:hidden"
              >
                {mobileOpen ? "Hide" : "Show"}
              </button>

              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setParams({})}
                  className="text-xs text-[var(--ttr-text-soft)] underline underline-offset-4"
                >
                  Reset
                </button>
              )}
            </div>

            <div
              id="filter-fields"
              className={`${mobileOpen ? "block" : "hidden"} mt-7 lg:block`}
            >
              <FilterFields
                key={query}
                params={params}
                catalog={catalog}
                category={category}
                loadError={catalogError}
                onChange={changeFilters}
                onChooseCategory={chooseCategory}
                onRetry={() => setCatalogRetry((value) => value + 1)}
              />
            </div>
          </aside>

          <div id="catalog-results" className="min-w-0 scroll-mt-28">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <form
                key={params.get("search") || ""}
                role="search"
                onSubmit={(event) => {
                  event.preventDefault();
                  changeFilters({
                    search: new FormData(event.currentTarget).get("search").trim(),
                  });
                }}
                className="relative flex-1"
              >
                <label htmlFor="plant-search" className="sr-only">
                  Search plants
                </label>
                <input
                  id="plant-search"
                  name="search"
                  type="search"
                  defaultValue={params.get("search") || ""}
                  placeholder="Search by plant or local name…"
                  className={`${inputStyle} pr-12`}
                />
                <button
                  type="submit"
                  aria-label="Search plants"
                  className="absolute right-1 top-1 rounded-md p-2.5 text-[var(--ttr-green)] hover:bg-[var(--ttr-bg-soft)]"
                >
                  <Search size={18} />
                </button>
              </form>

              <div className="flex items-center gap-3">
                <label
                  htmlFor="sort-plants"
                  className="shrink-0 text-xs text-[var(--ttr-text-muted)]"
                >
                  Sort by
                </label>
                <select
                  id="sort-plants"
                  value={params.get("ordering") || "-created_at"}
                  onChange={(event) => changeFilters({ ordering: event.target.value })}
                  className={`${inputStyle} xl:w-48`}
                >
                  <option value="-created_at">Newest arrivals</option>
                  <option value="price">Price: low to high</option>
                  <option value="-price">Price: high to low</option>
                  <option value="name">Name: A–Z</option>
                  <option value="-name">Name: Z–A</option>
                </select>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2" aria-label="Active filters">
                {activeFilters.map(({ key, value }) => {
                  const label = getActiveFilterLabel(
                    key,
                    value,
                    catalog,
                    selectedCategory?.name,
                  );

                  return (
                    <button
                      key={`${key}:${value}`}
                      type="button"
                      onClick={() => removeFilter(key, value)}
                      aria-label={`Remove ${label} filter`}
                      className="flex items-center gap-2 rounded-full bg-[var(--ttr-bg-soft)] px-3 py-2 text-xs"
                    >
                      {label}
                      <X size={13} />
                    </button>
                  );
                })}
              </div>
            )}

            <p role="status" className="my-6 text-xs text-[var(--ttr-text-muted)]">
              {pending
                ? "Finding your products…"
                : result.error
                  ? "Unable to load products"
                  : `${result.data.count} ${result.data.count === 1 ? "product" : "products"} found`}
            </p>

            {pending ? (
              <div aria-hidden="true" className="grid grid-cols-2 gap-5 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[4/5] rounded-lg bg-[var(--ttr-bg-soft)]" />
                    <div className="mt-4 h-3 w-2/3 bg-[var(--ttr-bg-soft)]" />
                  </div>
                ))}
              </div>
            ) : result.error ? (
              <div
                role="alert"
                className="rounded-xl border border-[var(--ttr-border)] p-10 text-center"
              >
                <p>We couldn’t load this collection. Please try again.</p>
                <button
                  onClick={() => setRetry((value) => value + 1)}
                  className="mt-5 underline underline-offset-4"
                >
                  Try again
                </button>
                {page > 1 && (
                  <button
                    onClick={() => goToPage(1)}
                    className="ml-5 underline underline-offset-4"
                  >
                    Back to first page
                  </button>
                )}
              </div>
            ) : result.data.results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--ttr-border)] px-6 py-20 text-center">
                <Leaf className="mx-auto text-[var(--ttr-green)]" size={32} />
                <h2 className="mt-5 font-serif text-2xl">No products found</h2>
                <p className="mt-3 text-sm text-[var(--ttr-text-soft)]">
                  Try another search or give your filters a little more room.
                </p>
                <button
                  onClick={() => setParams({})}
                  className="mt-6 text-sm underline underline-offset-4"
                >
                  View all products
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                  {result.data.results.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {(result.data.next || result.data.previous) && (
                  <nav
                    aria-label="Product pagination"
                    className="mt-12 flex items-center justify-between gap-3 border-t border-[var(--ttr-border)] pt-6"
                  >
                    <button
                      disabled={!result.data.previous}
                      onClick={() => goToPage(page - 1)}
                      className="flex items-center gap-2 rounded-lg border border-[var(--ttr-border)] px-4 py-3 text-sm disabled:opacity-40"
                    >
                      <ArrowLeft size={15} />
                      Previous
                    </button>

                    <span className="text-xs text-[var(--ttr-text-muted)]">Page {page}</span>

                    <button
                      disabled={!result.data.next}
                      onClick={() => goToPage(page + 1)}
                      className="flex items-center gap-2 rounded-lg border border-[var(--ttr-border)] px-4 py-3 text-sm disabled:opacity-40"
                    >
                      Next
                      <ArrowRight size={15} />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
