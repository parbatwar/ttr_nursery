import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import { CONTACT, getWhatsAppLink } from "../lib/contact";

function getContactRows() {
  const whatsappLink = getWhatsAppLink();

  const rows = [
    { label: "Call us", value: CONTACT.phone, href: `tel:${CONTACT.phone}`, Icon: Phone },
    {
      label: "WhatsApp",
      value: whatsappLink && "Message us",
      href: whatsappLink,
      Icon: MessageCircle,
      isExternal: true,
    },
    { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, Icon: Mail },
    {
      label: "Visit",
      value: CONTACT.address,
      href: CONTACT.directionsUrl,
      Icon: MapPin,
      isExternal: true,
    },
    { label: "Hours", value: CONTACT.hours, Icon: Clock },
  ];

  // Details left blank in contact.js stay hidden.
  return rows.filter((row) => row.value);
}

function ContactRow({ label, value, href, Icon, isExternal = false }) {
  const content = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--ttr-sage)] text-[var(--ttr-green)]">
        <Icon size={20} strokeWidth={1.5} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[13px] text-[var(--ttr-text-muted)]">{label}</span>
        <span className="block truncate font-medium group-hover:text-[var(--ttr-green)]">
          {value}
        </span>
      </span>

    </>
  );

  const rowStyle = "group flex items-center gap-3.5 py-3";

  if (!href) {
    return <div className={rowStyle}>{content}</div>;
  }

  return (
    <a
      href={href}
      className={rowStyle}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  );
}

export default function Contact() {
  const rows = getContactRows();

  return (
    <section className="relative lg:h-[calc(100vh-80px)] lg:min-h-[720px]">
      {/* On phones the map sits above the card. On desktop it fills the page behind it.
          The map is pulled up 150px to crop Google's info box, which would sit behind the card. */}
      <div className="h-80 overflow-hidden lg:absolute lg:inset-0 lg:h-full">
        <iframe
          src={CONTACT.mapEmbedUrl}
          title="TTR Banglamukhi Nursery on Google Maps"
          referrerPolicy="no-referrer-when-downgrade"
          className="-mt-[150px] block h-[calc(100%+150px)] w-full border-0"
        />
      </div>

      <div className="pointer-events-none relative mx-auto flex h-full w-[calc(100%-32px)] max-w-[var(--ttr-container)] items-center lg:w-[calc(100%-64px)]">
        <div className="pointer-events-auto mb-12 mt-4 w-full rounded-2xl bg-[var(--ttr-bg)] p-6 shadow-[0_20px_50px_rgba(24,35,27,0.18)] lg:my-0 lg:w-[460px] lg:p-9">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.08em] text-[var(--ttr-text-muted)]">
            Contact us
          </p>

          <h1 className="text-[44px] leading-none lg:text-[56px]">
            Come and see <em>the plants.</em>
          </h1>

          <p className="mt-4 leading-7 text-[var(--ttr-text-soft)]">
            Ask about plants, delivery, landscaping or office rentals.
          </p>

          <div className="mt-5 divide-y divide-[var(--ttr-border)] border-y border-[var(--ttr-border)]">
            {rows.map((row) => (
              <ContactRow key={row.label} {...row} />
            ))}
          </div>

          <SocialLinks
            className="mt-4 -ml-2.5 gap-1"
            linkClassName="text-[var(--ttr-green)] hover:bg-[var(--ttr-sage)]"
          />
        </div>
      </div>
    </section>
  );
}
