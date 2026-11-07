import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SERVICES = [
  {
    title: "Landscape Design & Build",
    description:
      "Most gardens start with a plant. Yours should start with a question: how do you want this place to feel? A quiet corner for your morning tea? An entrance that makes clients stop and look? Tell us, and we'll handle everything after that: the design, the build and every plant that goes in.",
    image: "/images/service-landscape.jpg",
  },
  {
    title: "Plants & Flowers",
    description:
      "A plant that loves a sunny terrace will sulk in a dark office. That's why the first thing we'll ask is where it's going. Then we'll show you what will be happy there: indoor or outdoor, seasonal or perennial, flowering or fruiting. One pot or a whole garden's worth, you get the same honest answer.",
    image: "/images/service-plants.jpg",
  },
  {
    title: "Plant Rentals",
    description:
      "Need plants for your office? An empty lobby? An event? You don't have to buy a single one. Rent them once for the occasion, or on a contract for your office, for as long as you need them. If a plant starts to look tired, we replace it, so your space always looks fresh.",
    image: "/images/service-rentals.jpg",
  },
  {
    title: "Garden Care & Maintenance",
    description:
      "A garden rarely falls apart all at once. A shrub gets leggy, a bed goes thin, and one day the whole place just looks tired. Regular care stops that before it starts. We prune, plant and replace what's past its best, so your garden keeps looking the way you wanted, without taking up your weekends.",
    image: "/images/service-care.jpg",
  },
];

export default function Services() {
  return (
    <div className="mx-auto grid w-[calc(100%-32px)] max-w-[var(--ttr-container)] gap-10 py-12 lg:w-[calc(100%-64px)] lg:grid-cols-[5fr_7fr] lg:gap-[72px] lg:py-20">
      {/* The heading and button stay on screen while the services scroll past. */}
      <div className="flex flex-col items-start self-start lg:sticky lg:top-28">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.08em] text-[var(--ttr-text-muted)]">
          Our services
        </p>

        <h1 className="text-[52px] leading-none lg:text-[72px]">
          Everything your <em>green space</em> needs.
        </h1>

        <p className="mt-6 max-w-sm leading-7 text-[var(--ttr-text-soft)]">
          Not sure which you need? Tell us about your space, and we&apos;ll point you the right
          way.
        </p>

        <Link to="/contact" className="ttr-pill ttr-pill-dark mt-6">
          Make an inquiry
          <span className="ttr-pill-circle">
            <ArrowRight size={18} strokeWidth={1.8} />
          </span>
        </Link>
      </div>

      <div className="divide-y divide-[var(--ttr-border)]">
        {SERVICES.map((service) => (
          <article
            key={service.title}
            className="grid gap-5 py-7 first:pt-0 last:pb-0 sm:grid-cols-[240px_1fr] sm:gap-7 lg:py-8"
          >
            <img
              src={service.image}
              alt=""
              loading="lazy"
              className="ttr-photo h-56 w-full rounded-xl object-cover sm:h-[200px] sm:w-[240px]"
            />

            <div>
              <h2 className="text-[34px] lg:text-[36px]">{service.title}</h2>
              <p className="mt-2.5 text-[15px] leading-6 text-[var(--ttr-text-soft)]">
                {service.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
