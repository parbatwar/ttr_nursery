import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="mx-auto w-[calc(100%-32px)] max-w-[var(--ttr-container)] py-12 lg:w-[calc(100%-64px)] lg:py-20">
      <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-14">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.08em] text-[var(--ttr-text-muted)]">
          About us
        </p>
        <h1 className="text-[52px] leading-none lg:text-[84px]">
          Growing plants long before they became part of the <em>aesthetic.</em>
        </h1>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <img
          src="/images/story-bougainvillea.jpg"
          alt="Bougainvillea in bloom at TTR Banglamukhi Nursery"
          className="h-[340px] w-full rounded-xl object-cover lg:h-[560px]"
        />

        <div className="flex flex-col justify-between rounded-xl bg-[var(--ttr-bg-soft)] p-6 lg:p-10">
          <div>
            <p className="font-serif text-[84px] leading-none">25+</p>
            <p className="mt-1 text-[var(--ttr-text-muted)]">years of growing</p>
          </div>

          <p className="mt-8 text-[17px] leading-7 text-[var(--ttr-text-soft)]">
            TTR Nursery has spent more than two decades growing plants and flowers in
            Nepal. What began with a love for cultivation continues today with the same
            patience, care and respect for things that take time.
          </p>

          <div className="mt-8">
            <Link to="/products" className="ttr-pill ttr-pill-dark">
              Shop plants
              <span className="ttr-pill-circle">
                <ArrowRight size={18} strokeWidth={1.8} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
