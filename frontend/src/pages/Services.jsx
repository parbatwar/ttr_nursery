import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SERVICES = [
  {
    title: "Landscape Design & Build",
    description: "Design, build and planting for homes, offices and commercial spaces.",
    image: "/images/service-landscape.jpg",
  },
  {
    title: "Plants & Flowers",
    description: "Indoor, outdoor, seasonal, perennial and fruiting plants.",
    image: "/images/service-plants.jpg",
  },
  {
    title: "Plant Rentals",
    description: "Plant rentals for offices, workspaces, events and special occasions.",
    image: "/images/service-rentals.jpg",
  },
  {
    title: "Garden Care & Maintenance",
    description: "Pruning, planting, replacement and regular garden care.",
    image: "/images/service-care.jpg",
  },
];

export default function Services() {
  return (
    <div className="mx-auto w-[calc(100%-32px)] max-w-[var(--ttr-container)] py-12 lg:w-[calc(100%-64px)] lg:py-20">
      <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.08em] text-[var(--ttr-text-muted)]">
          Our services
        </p>
        <h1 className="text-[52px] leading-none lg:text-[84px]">
          Everything your <em>green space</em> needs.
        </h1>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {SERVICES.map((service) => (
          <article
            key={service.title}
            className="overflow-hidden rounded-xl bg-[var(--ttr-bg-soft)]"
          >
            <img
              src={service.image}
              alt=""
              loading="lazy"
              className="ttr-photo h-[260px] w-full object-cover lg:h-[380px]"
            />
            <div className="p-6">
              <h2 className="text-[36px]">{service.title}</h2>
              <p className="mt-2 text-[var(--ttr-text-soft)]">{service.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link to="/contact" className="ttr-pill ttr-pill-dark">
          Talk to us
          <span className="ttr-pill-circle">
            <ArrowRight size={18} strokeWidth={1.8} />
          </span>
        </Link>
      </div>
    </div>
  );
}
