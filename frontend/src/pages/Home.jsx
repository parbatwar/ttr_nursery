import { Link } from "react-router-dom";
import {
  Trees,
  Flower2,
  CalendarDays,
  Sprout,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  // TODO: replace with real product photography, shot in the nursery —
  // warm natural light, shallow depth of field, consistent color grade.
  const featuredPlants = [
    {
      id: 1,
      name: "Monstera Deliciosa",
      category: "Indoor Plant",
      price: "1,200",
      image: "/plants/monstera.jpg",
    },
    {
      id: 2,
      name: "Snake Plant",
      category: "Indoor Plant",
      price: "900",
      image: "/plants/snake-plant.jpg",
    },
    {
      id: 3,
      name: "Peace Lily",
      category: "Flowering Plant",
      price: "1,000",
      image: "/plants/peace-lily.jpg",
    },
    {
      id: 4,
      name: "Fiddle Leaf Fig",
      category: "Indoor Plant",
      price: "1,500",
      image: "/plants/fiddle-leaf-fig.jpg",
    },
  ];

  const categories = [
    {
      id: 1,
      name: "Indoor Plants",
      label: "For inside",
      image: "/category-indoor.jpg",
      link: "/products?category=indoor",
      layout: "lg:col-span-2 lg:row-span-2",
    },
    {
      id: 2,
      name: "Outdoor Plants",
      label: "In bloom now",
      image: "/category-seasonal.jpg",
      link: "/products?category=seasonal",
      layout: "lg:col-span-2",
    },
    {
      id: 3,
      name: "Pots & Planters",
      label: "For every plant",
      image: "/category-pots.jpg",
      link: "/products?category=pots",
      layout: "lg:col-span-1",
    },
    {
      id: 4,
      name: "Plant Care",
      label: "For the garden",
      image: "/category-outdoor.jpg",
      link: "/products?category=outdoor",
      layout: "lg:col-span-1",
    },
  ];

  const services = [
    {
      id: 1,
      number: "01",
      icon: Trees,
      title: "Landscape Design & Build",
      description:
        "Design, build and planting for homes, offices and commercial spaces.",
      link: "/services/landscape",
      hoverBg: "#DCE4D8",
    },
    {
      id: 2,
      number: "02",
      icon: Flower2,
      title: "Plants & Flowers",
      description:
        "Indoor, outdoor, seasonal, perennial and fruiting plants.",
      link: "/services/plants-and-flowers",
      hoverBg: "#E8E1D2",
    },
    {
      id: 3,
      number: "03",
      icon: CalendarDays,
      title: "Plant Rentals",
      description:
        "Plant rentals for offices, workspaces, events and special occasions.",
      link: "/services/plant-rentals",
      hoverBg: "#E5DDD6",
    },
    {
      id: 4,
      number: "04",
      icon: Sprout,
      title: "Garden Care & Maintenance",
      description: "Pruning, planting, replacement and regular garden care.",
      link: "/services/garden-care",
      hoverBg: "#DDE5DC",
    },
  ];

  return (
    <main className="overflow-hidden bg-[var(--ttr-bg)] text-[var(--ttr-text)]">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section>
        <div className="relative min-h-[75vh] w-full overflow-hidden bg-[var(--ttr-bg-soft)] sm:min-h-[80vh]">
          <img
            src="/bougain2.jpg"
            alt="Plants at TTR Nursery"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#222820]/65 via-[#222820]/20 to-transparent" />

          <div className="relative z-10 flex min-h-[75vh] items-end sm:min-h-[80vh]">
            <div className="w-full px-7 pb-12 sm:px-12 sm:pb-16 lg:px-16 lg:pb-20">
              <div className="max-w-2xl text-[#F8F4EC]">
                <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-[#F8F4EC]/70">
                  TTR Banglamukhi Nursery · Nepal
                </p>

                <h1 className="font-serif text-5xl font-normal leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                  Grown in the valley,
                  <br />
                  for your home.
                </h1>

                <p className="mt-7 max-w-md text-sm leading-7 text-[#F8F4EC]/80 sm:text-[15px]">
                  Plants and flowers cultivated with patience in Nepal for
                  more than twenty-five years.
                </p>

                
                <a
                href="#collection"
                className="mt-9 inline-flex items-center gap-4 border border-[#F8F4EC]/70 bg-[#F8F4EC]/10 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#F8F4EC] backdrop-blur-sm transition-all duration-300 hover:border-[#F8F4EC] hover:bg-[#F8F4EC]/20"
                >
                Explore the collection
                <span>↓</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED COLLECTION
      ===================================================== */}
      <section
        id="collection"
        className="border-t border-[var(--ttr-border-soft)] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24"
      >
        <div className="mx-auto max-w-[var(--ttr-container)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--ttr-green)]">
                Our collection
              </p>

              <h2 className="font-serif text-4xl font-normal tracking-[-0.025em] sm:text-5xl">
                Plants worth living with.
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden border-b border-[var(--ttr-text-muted)] pb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--ttr-text-soft)] transition-opacity hover:opacity-50 sm:block"
            >
              View all plants
            </Link>
          </div>

          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featuredPlants.map((plant) => (
              <Link
                key={plant.id}
                to={`/products/${plant.id}`}
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[var(--ttr-bg-soft)]">
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[var(--ttr-text-muted)]">
                    {plant.category}
                  </p>

                  <div className="mt-2 flex items-start justify-between gap-4">
                    <h3 className="font-serif text-lg font-normal leading-tight">
                      {plant.name}
                    </h3>

                    <p className="shrink-0 text-xs text-[var(--ttr-text-soft)]">
                      Rs. {plant.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Link
            to="/products"
            className="mt-12 inline-flex border-b border-[var(--ttr-text-muted)] pb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--ttr-text-soft)] sm:hidden"
          >
            View all plants
          </Link>
        </div>
      </section>

      {/* =====================================================
          HERITAGE TEASER
      ===================================================== */}
      <section
        id="story"
        className="border-t border-[var(--ttr-border-soft)] bg-[var(--ttr-bg-soft)] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28"
      >
        <div className="mx-auto max-w-[var(--ttr-container)]">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Image */}
            <div className="lg:col-span-5">
              <figure className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -bottom-3 -left-3 hidden h-full w-full border border-[var(--ttr-green)] opacity-25 sm:block"
                />

                <div className="relative h-[280px] overflow-hidden bg-[var(--ttr-bg-soft)] sm:h-[320px] lg:h-[380px]">
                  <img
                    src="/bougain2.jpg"
                    alt="Bougainvillea in bloom at TTR Banglamukhi Nursery"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />

                  <div className="absolute bottom-4 left-4 bg-[var(--ttr-bg)] px-4 py-3">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[var(--ttr-text-muted)]">
                      Growing for
                    </p>

                    <p className="mt-1 font-serif text-xl text-[var(--ttr-text)]">
                      25+ years
                    </p>
                  </div>
                </div>

                <figcaption className="mt-3 text-[9px] uppercase tracking-[0.18em] text-[var(--ttr-text-muted)]">
                    TTR Banglamukhi Nursery
                </figcaption>
              </figure>
            </div>

            {/* Text */}
            <div className="lg:col-span-6 lg:col-start-7">
              <h2 className="font-serif text-3xl font-normal leading-[1.16] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
                Growing plants long before they became part of the aesthetic.
              </h2>
                <br></br>
              <p className="mt-7 max-w-xl text-sm leading-7 text-[var(--ttr-text-soft)]">
                TTR Nursery has spent more than two decades growing plants and
                flowers in Nepal. What began with a love for cultivation
                continues today with the same patience, care and respect for
                things that take time.
              </p>

              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-3 border-b border-[var(--ttr-text-muted)] pb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--ttr-text)] transition-opacity hover:opacity-50"
              >
                Read our story
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SHOP BY CATEGORY
      ===================================================== */}
      <section className="border-t border-[var(--ttr-border-soft)] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[var(--ttr-container)]">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--ttr-green)]">
                Explore the nursery
              </p>

              <h2 className="font-serif text-4xl font-normal tracking-[-0.025em] sm:text-5xl">
                Find your kind of green.
              </h2>
            </div>
          </div>

          <div className="grid auto-rows-[210px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.link}
                className={`group relative overflow-hidden bg-[var(--ttr-bg-soft)] ${category.layout}`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#182018]/70 via-[#182018]/10 to-transparent transition-colors duration-500 group-hover:from-[#182018]/80" />

                <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/65">
                      {category.label}
                    </p>

                    <span className="flex h-8 w-8 items-center justify-center border border-white/35 text-sm text-white transition-all duration-300 group-hover:bg-white group-hover:text-[#283027]">
                      ↗
                    </span>
                  </div>

                  <div>
                    <h3 className="max-w-[260px] font-serif text-2xl font-normal leading-tight text-[#F8F4EC] sm:text-[27px]">
                      {category.name}
                    </h3>

                    <div className="mt-3 h-px w-0 bg-white/70 transition-all duration-500 group-hover:w-10" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR SERVICES
      ===================================================== */}
      <section className="border-t border-[var(--ttr-border-soft)] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[var(--ttr-container)]">
          <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--ttr-green)]">
                Our services
              </p>

              <h2 className="font-serif text-4xl font-normal leading-[1.1] tracking-[-0.025em] sm:text-5xl">
                Everything your
                <br />
                green space needs.
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.id}
                  to={service.link}
                  style={{ "--hover-bg": service.hoverBg }}
                  className="group flex min-h-[320px] flex-col border border-[var(--ttr-border-soft)] p-7 transition-all duration-500 hover:border-transparent hover:bg-[var(--hover-bg)] sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <Icon
                      size={26}
                      strokeWidth={1.25}
                      className="text-[var(--ttr-green)]"
                    />

                    <span className="text-[9px] tracking-[0.22em] text-[var(--ttr-text-muted)]">
                      {service.number}
                    </span>
                  </div>

                  <div className="mt-10">
                    <h3 className="pb-4 font-serif text-2xl font-normal leading-[1.2]">
                      {service.title}
                    </h3>

                    <p className="mt-6 max-w-[24ch] text-sm leading-6 text-[var(--ttr-text-soft)]">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-10">
                    <span className="text-[9px] font-medium uppercase tracking-[0.18em]">
                      Explore service
                    </span>

                    <ArrowUpRight
                      size={17}
                      strokeWidth={1.4}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


        {/* =====================================================
            FINAL CTA
        ===================================================== */}
        <section className="border-t border-[var(--ttr-border-soft)] bg-[var(--ttr-bg-soft)] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-[var(--ttr-container)]">

            <div className="grid gap-12 lg:grid-cols-12 lg:items-end">

            {/* Main message */}
            <div className="lg:col-span-8">
                <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--ttr-green)]">
                Bring something home
                </p>

                <h2 className="max-w-4xl font-serif text-5xl font-normal leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Make room for
                <br />
                something
                <span className="italic text-[var(--ttr-green)]"> living.</span>
                </h2>
            </div>

            {/* Supporting content */}
            <div className="lg:col-span-3 lg:col-start-10">
                <p className="max-w-sm text-sm leading-7 text-[var(--ttr-text-soft)]">
                Discover plants, flowers and greenery selected for homes,
                workspaces and everyday spaces.
                </p>

                <Link
                to="/products"
                className="group mt-8 inline-flex items-center gap-5 border-b border-[var(--ttr-text-muted)] pb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--ttr-text)] transition-colors duration-300 hover:border-[var(--ttr-green)] hover:text-[var(--ttr-green)]"
                >
                Explore the nursery

                <span className="text-sm transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                </span>
                </Link>
            </div>
            </div>

        </div>
        </section>
    </main>
  );
}