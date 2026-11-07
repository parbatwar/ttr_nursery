import { MapPin } from "lucide-react";
import { CONTACT, getWhatsAppLink } from "../lib/contact";

const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://www.instagram.com/ttrnursery" },
  { name: "Facebook", href: "https://www.facebook.com/ttrnurseryNP" },
  { name: "TikTok", href: "https://www.tiktok.com/@ttrnursery" },
];

const linkStyle =
  "flex min-h-11 items-center rounded-full bg-white px-5 font-medium transition hover:bg-[var(--ttr-text)] hover:text-white";

export default function Contact() {
  const whatsappLink = getWhatsAppLink();

  return (
    <div className="mx-auto w-[calc(100%-32px)] max-w-[var(--ttr-container)] py-12 lg:w-[calc(100%-64px)] lg:py-20">
      <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.08em] text-[var(--ttr-text-muted)]">
          Contact us
        </p>
        <h1 className="text-[52px] leading-none lg:text-[84px]">
          Come and see <em>the plants.</em>
        </h1>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <section className="rounded-xl bg-[var(--ttr-bg-soft)] p-6 lg:p-10">
          <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-white text-[var(--ttr-green)]">
            <MapPin size={24} strokeWidth={1.5} />
          </span>
          <h2 className="mt-7 text-[36px]">Visit the nursery</h2>
          <p className="mt-2 text-[17px] text-[var(--ttr-text-soft)]">{CONTACT.address}</p>

          {CONTACT.hours && (
            <p className="mt-1 text-[var(--ttr-text-soft)]">{CONTACT.hours}</p>
          )}

          {CONTACT.mapEmbedUrl && (
            <iframe
              src={CONTACT.mapEmbedUrl}
              title="TTR Banglamukhi Nursery on Google Maps"
              loading="lazy"
              className="mt-5 h-64 w-full rounded-2xl border-0"
            />
          )}
        </section>

        <section className="rounded-xl bg-[var(--ttr-bg-soft)] p-6 lg:p-10">
          <h2 className="text-[36px]">Message us</h2>
          <p className="mt-2 text-[var(--ttr-text-soft)]">
            Ask about plants, delivery, landscaping or office rentals.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={linkStyle}
              >
                WhatsApp
              </a>
            )}

            {CONTACT.phone && (
              <a href={`tel:${CONTACT.phone}`} className={linkStyle}>
                {CONTACT.phone}
              </a>
            )}

            {CONTACT.email && (
              <a href={`mailto:${CONTACT.email}`} className={linkStyle}>
                {CONTACT.email}
              </a>
            )}

            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkStyle}
              >
                {link.name}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
