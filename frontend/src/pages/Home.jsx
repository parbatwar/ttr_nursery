import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Flower2,
  Sprout,
  Star,
  Trees,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/products";

const STATS = [
  { number: "25", suffix: "+", label: "Years growing plants" },
  { number: "100", suffix: "+", label: "Plant varieties" },
  { number: "1,000", suffix: "+", label: "Happy customers" },
];

// Short summaries of real Google reviews, with each reviewer's star rating.
// To show a customer's own words, replace the text here.
const REVIEWS_TOP = [
  { text: "A place worth recommending for buying flowers.", stars: 5 },
  { text: "A wide range of flowers, fruit trees, plants and succulents.", stars: 5 },
  { text: "A lovely spot, with flowers everywhere you look.", stars: 5 },
  { text: "Indoor and outdoor plants, plus landscaping and accessories.", stars: 5 },
  { text: "A good place to come for flowers.", stars: 4 },
];

const REVIEWS_BOTTOM = [
  REVIEWS_TOP[3],
  REVIEWS_TOP[4],
  REVIEWS_TOP[1],
  REVIEWS_TOP[2],
  REVIEWS_TOP[0],
];

const CATEGORIES = [
  {
    name: "Indoor",
    description: "Greenery for your living spaces",
    image: "/images/category-indoor.jpg",
    link: "/products?category=indoor",
    layout: "col-span-2 h-72 lg:col-span-5 lg:row-span-2 lg:h-auto",
  },
  {
    name: "Outdoor",
    description: "For gardens, balconies and beyond",
    image: "/images/category-outdoor.jpg",
    link: "/products?category=outdoor",
    layout: "col-span-2 h-60 lg:col-span-7 lg:h-auto",
  },
  {
    name: "Fruit & Herbs",
    description: "",
    image: "/images/category-fruit-herbs.jpg",
    link: "/products?category=fruit-herbs",
    layout: "h-56 lg:col-span-3 lg:h-auto",
  },
  {
    name: "Pots & Garden Care",
    description: "",
    image: "/images/category-pots.jpg",
    link: "/products?category=pots-garden-care",
    layout: "h-56 lg:col-span-4 lg:h-auto",
  },
];

const SERVICES = [
  {
    title: "Landscape Design & Build",
    description: "Design, build and planting for homes, offices and commercial spaces.",
    Icon: Trees,
  },
  {
    title: "Plants & Flowers",
    description: "Indoor, outdoor, seasonal, perennial and fruiting plants.",
    Icon: Flower2,
  },
  {
    title: "Plant Rentals",
    description: "Plant rentals for offices, workspaces, events and special occasions.",
    Icon: CalendarDays,
  },
  {
    title: "Garden Care & Maintenance",
    description: "Pruning, planting, replacement and regular garden care.",
    Icon: Sprout,
  },
];

const sectionWidth =
  "mx-auto w-[calc(100%-32px)] max-w-[var(--ttr-container)] lg:w-[calc(100%-64px)]";

function PillLink({ to, dark = false, children }) {
  return (
    <Link to={to} className={`ttr-pill ${dark ? "ttr-pill-dark" : "ttr-pill-light"}`}>
      {children}
      <span className="ttr-pill-circle">
        <ArrowRight size={18} strokeWidth={1.8} />
      </span>
    </Link>
  );
}

function SectionHeading({ label, labelColor = "text-[var(--ttr-text-muted)]", children }) {
  return (
    <div>
      <p className={`mb-3 text-sm font-medium uppercase tracking-[0.08em] ${labelColor}`}>
        {label}
      </p>
      <h2 className="text-[40px] lg:text-[56px]">{children}</h2>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative h-[640px] overflow-hidden text-white lg:h-[calc(100vh-80px)] lg:min-h-[640px] lg:max-h-[860px]">
      <img
        src="/images/hero-bougainvillea.jpg"
        alt="Bougainvillea in bloom"
        className="absolute inset-0 h-full w-full object-cover object-[70%_center] lg:object-center"
      />

      {/* Keeps the text readable: darker on the left on desktop, lower down on phones. */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08120b]/90 via-[#08120b]/60 to-[#08120b]/10 lg:hidden" />
      <div className="absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(8,18,11,0.86)_0%,rgba(8,18,11,0.6)_40%,rgba(8,18,11,0)_70%)] lg:block" />

      <div className="relative mx-auto flex h-full w-[calc(100%-32px)] max-w-[var(--ttr-container)] flex-col justify-end pb-10 lg:w-[calc(100%-64px)] lg:justify-center lg:pb-0">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.08em]">
          TTR Banglamukhi Nursery · 25+ years of growing
        </p>

        <h1 className="text-[56px] leading-none lg:text-[104px]">
          Bring your spaces
          <br />
          <em>to life.</em>
        </h1>

        <p className="mb-7 mt-5 max-w-md text-lg leading-7">
          Plants grown in Nepal for homes and offices, delivered across the Kathmandu
          Valley.
        </p>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Link to="/products" className="ttr-pill ttr-pill-accent">
            Find your perfect plant
            <span className="ttr-pill-circle">
              <ArrowRight size={18} strokeWidth={1.8} />
            </span>
          </Link>

          <Link
            to="/contact"
            className="flex min-h-12 items-center gap-2 rounded-full border border-white/85 px-5 font-semibold text-white transition-colors hover:bg-white hover:text-[var(--ttr-text)]"
          >
            Ask about landscaping & rentals
            <ArrowRight size={17} strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatsBand() {
  return (
    <section className="bg-[var(--ttr-sage)] text-[var(--ttr-green)]">
      <div
        className={`${sectionWidth} grid gap-7 py-9 lg:grid-cols-[1fr_380px] lg:items-center lg:gap-10 lg:py-12`}
      >
        <dl className="grid grid-cols-3 lg:flex">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col-reverse justify-end px-3 first:pl-0 lg:px-10 ${
                index > 0 ? "border-l border-[var(--ttr-green)]/25" : ""
              }`}
            >
              <dt className="mt-2 text-[13px] leading-snug lg:whitespace-nowrap lg:text-sm">
                {stat.label}
              </dt>
              <dd className="text-[38px] font-light leading-none tracking-[-0.03em] lg:text-[56px]">
                {stat.number}
                <span className="ml-0.5 text-[24px] lg:text-[34px]">{stat.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div>
          <p className="mb-2 text-[15px] leading-6 text-[#3a4a3c]">
            Plants grown at our own nursery in Nepal and delivered to your door. Pay in cash
            when they arrive, with no account needed.
          </p>

          <Link
            to="/products"
            className="group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold"
          >
            Find your perfect plant
            <ArrowRight
              size={16}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stars({ count }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          strokeWidth={0}
          className={star <= count ? "fill-[#d9a92e]" : "fill-[#d8d9d4]"}
        />
      ))}
    </span>
  );
}

function ReviewBubble({ review, hidden = false }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      className="mr-3 w-[290px] shrink-0 rounded-3xl bg-white px-5 py-[18px] shadow-[0_10px_26px_rgba(24,35,27,0.08)] lg:mr-[18px] lg:w-[390px]"
    >
      <blockquote className="text-base leading-snug">{review.text}</blockquote>

      <figcaption className="mt-2.5 flex items-center justify-between gap-3.5">
        <Stars count={review.stars} />
        <span className="text-[13px] text-[var(--ttr-text-muted)]">From Google reviews</span>
      </figcaption>
    </figure>
  );
}

// The list repeats four times so the loop has no gap, even on very wide screens.
// Screen readers only read the first copy.
function ReviewRow({ reviews, reverse = false }) {
  const copies = [0, 1, 2, 3];

  return (
    <div className={`ttr-drift-track ${reverse ? "ttr-drift-reverse" : ""}`}>
      {copies.map((copy) =>
        reviews.map((review) => (
          <ReviewBubble key={`${copy}-${review.text}`} review={review} hidden={copy > 0} />
        )),
      )}
    </div>
  );
}

function Reviews() {
  return (
    <section className="pt-16 lg:pt-24">
      <div className={`${sectionWidth} mb-6 lg:mb-7`}>
        <SectionHeading label="Customer reviews">What people say about us.</SectionHeading>
      </div>

      {/* Hovering a row pauses it so the text is easy to read. */}
      <div className="ttr-drift flex flex-col gap-3 py-6 lg:gap-[18px]">
        <ReviewRow reviews={REVIEWS_TOP} />
        <ReviewRow reviews={REVIEWS_BOTTOM} reverse />
      </div>
    </section>
  );
}

function CategoryBento() {
  return (
    <section className={`${sectionWidth} pt-14 lg:pt-20`}>
      <div className="mb-7">
        <SectionHeading label="Explore the nursery">Shop by category</SectionHeading>
      </div>

      <div className="grid grid-cols-2 gap-2.5 lg:h-[640px] lg:grid-cols-12 lg:grid-rows-2 lg:gap-3">
        {CATEGORIES.map((category) => (
          <Link
            key={category.name}
            to={category.link}
            className={`group relative overflow-hidden rounded-xl bg-[var(--ttr-bg-soft)] ${category.layout}`}
          >
            <img
              src={category.image}
              alt=""
              loading="lazy"
              className="ttr-photo absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0a160e]/60 via-[#0a160e]/5 to-transparent" />

            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white lg:inset-x-6 lg:bottom-6">
              <div className="min-w-0">
                <h3 className="text-[28px] lg:text-[40px]">{category.name}</h3>
                {category.description && (
                  <p className="mt-1 text-[15px] text-white/90">{category.description}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Collection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    getProducts("", { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setProducts(data.results.slice(0, 4));
      })
      .catch((error) => {
        if (error.name !== "AbortError") setProducts([]);
      });

    return () => controller.abort();
  }, []);

  return (
    <section id="collection" className={`${sectionWidth} scroll-mt-24 pt-16 lg:pt-24`}>
      <div className="mb-7 flex items-end justify-between gap-5">
        <SectionHeading label="Our collection">Plants worth living with.</SectionHeading>

        <Link
          to="/products"
          className="hidden min-h-11 shrink-0 items-center font-semibold text-[var(--ttr-green)] sm:inline-flex"
        >
          View all plants ›
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Link
        to="/products"
        className="mt-4 inline-flex min-h-11 items-center font-semibold text-[var(--ttr-green)] sm:hidden"
      >
        View all plants ›
      </Link>
    </section>
  );
}

function FounderNote() {
  return (
    <section
      id="founder"
      className={`${sectionWidth} mt-16 grid scroll-mt-24 items-center gap-8 lg:mt-24 lg:grid-cols-[420px_1fr] lg:gap-20`}
    >
      <img
        src="/images/founder-rudra.jpg"
        alt="Rudra Kumar Sunuwar, founder of TTR Banglamukhi Nursery, in front of a wall of plants"
        loading="lazy"
        className="mx-auto aspect-square w-full max-w-[300px] rounded-full object-cover object-top lg:max-w-none"
      />

      <div className="flex max-w-[640px] flex-col items-start">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.08em] text-[var(--ttr-text-muted)]">
          A note from our founder
        </p>

        <h2 className="text-[40px] lg:text-[56px]">
          Bringing nature <em>closer to you.</em>
        </h2>

        <div className="mt-5 space-y-3 text-base leading-[25px] text-[var(--ttr-text-soft)]">
          <p>
            There&apos;s something special about being surrounded by nature: the calm it brings,
            the simple joy of watching something grow. After more than 25 years of growing plants
            in Nepal, I still feel it.
          </p>

          <p>
            Our vision is to make greenery a natural part of everyday living. After all, a home
            shouldn&apos;t just be a place where we live. It should be a place where life grows.
          </p>
        </div>

        <div className="mt-6">
          <p className="font-semibold">Rudra Kumar Sunuwar</p>
          <p className="mt-0.5 text-[15px] text-[var(--ttr-text-muted)]">
            Founder, TTR Banglamukhi Nursery
          </p>
        </div>

        <div className="mt-7">
          <PillLink to="/about" dark>
            Read our story
          </PillLink>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="mt-16 bg-[var(--ttr-sage)] py-12 lg:mt-24 lg:py-16">
      <div className={sectionWidth}>
        <div className="mb-8 flex flex-col items-start justify-between gap-5 lg:mb-9 lg:flex-row lg:items-end">
          <SectionHeading label="For homes, offices and businesses" labelColor="text-[#3a4a3c]">
            Everything your <em>green space</em> needs.
          </SectionHeading>

          <div className="shrink-0">
            <PillLink to="/contact" dark>
              Ask about our services
            </PillLink>
          </div>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          {SERVICES.map(({ title, description, Icon }) => (
            <Link
              key={title}
              to="/services"
              className="group flex min-h-[280px] flex-col rounded-xl bg-[var(--ttr-bg)] p-6 transition-colors duration-300 hover:bg-white lg:min-h-[340px]"
            >
              <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-[var(--ttr-sage)] text-[var(--ttr-green)]">
                <Icon size={26} strokeWidth={1.5} />
              </span>

              <h3 className="mt-7 text-[32px]">{title}</h3>
              <p className="mt-2.5 text-[15px] leading-6 text-[var(--ttr-text-soft)]">
                {description}
              </p>

              <span className="mt-auto flex items-center gap-2 pt-[18px] text-[15px] font-semibold text-[var(--ttr-green)]">
                Explore service
                <ArrowRight
                  size={18}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-clip bg-[var(--ttr-bg)] text-[var(--ttr-text)]">
      <Hero />

      <div className="pb-16 lg:pb-24">
        <StatsBand />
        <CategoryBento />
        <Collection />
        <Services />
        <Reviews />
        <FounderNote />
      </div>
    </div>
  );
}
