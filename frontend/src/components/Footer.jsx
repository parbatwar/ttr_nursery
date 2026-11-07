import { Link } from "react-router-dom";
import { CONTACT } from "../lib/contact";

function InstagramIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 21V13.3H16.1L16.5 10.3H13.5V8.4C13.5 7.5 13.8 6.9 15 6.9H16.6V4.2C16.3 4.2 15.3 4.1 14.2 4.1C11.9 4.1 10.3 5.5 10.3 8.1V10.3H7.7V13.3H10.3V21H13.5Z" />
    </svg>
  );
}

function TikTokIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M15.5 3C15.8 5.4 17.2 6.9 20 7.1V10.1C18.4 10.2 16.9 9.7 15.5 8.8V15.1C15.5 19 12.9 21 9.7 21C6.4 21 4 18.5 4 15.4C4 11.8 6.8 9.5 10.4 9.7V12.8C8.5 12.5 7 13.4 7 15.3C7 16.8 8.1 17.9 9.6 17.9C11.3 17.9 12.4 16.8 12.4 14.9V3H15.5Z" />
    </svg>
  );
}

const LINK_GROUPS = [
  {
    title: "Shop",
    links: [
      { name: "All products", to: "/products" },
      { name: "Indoor", to: "/products?category=indoor" },
      { name: "Outdoor", to: "/products?category=outdoor" },
      { name: "Fruit & Herbs", to: "/products?category=fruit-herbs" },
      { name: "Pots & Garden Care", to: "/products?category=pots-garden-care" },
    ],
  },
  {
    title: "Nursery",
    links: [
      { name: "Services", to: "/services" },
      { name: "About", to: "/about" },
      { name: "Contact Us", to: "/contact" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/ttrnursery",
    Icon: InstagramIcon,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/ttrnurseryNP",
    Icon: FacebookIcon,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@ttrnursery",
    Icon: TikTokIcon,
  },
];

export default function Footer() {
  return (
    <footer className="ttr-footer text-white">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[var(--ttr-container)] pt-12 lg:w-[calc(100%-64px)] lg:pt-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pb-10 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:pb-14">
          <div className="col-span-2 lg:col-span-1">
            <img
              src="/logo-clean.png"
              alt="TTR Banglamukhi Nursery"
              className="h-24 w-auto"
            />
            <p className="mt-4 max-w-xs text-[15px] leading-6 text-white/70">
              Plants, flowers and everything your garden needs, for your home, your office and every
              space in between.
            </p>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-sm font-medium text-white/55">{group.title}</p>
              {group.links.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="flex min-h-9 w-fit items-center text-[15px] transition-colors hover:text-[var(--ttr-sec-gold)]"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          ))}

          <div>
            <p className="mb-3 text-sm font-medium text-white/55">Visit</p>
            <p className="text-[15px] leading-6">{CONTACT.address}</p>

            {CONTACT.hours && (
              <p className="mt-1 text-[15px] leading-6 text-white/70">{CONTACT.hours}</p>
            )}

            {CONTACT.phone && (
              <a
                href={`tel:${CONTACT.phone}`}
                className="flex min-h-9 w-fit items-center text-[15px] hover:text-[var(--ttr-sec-gold)]"
              >
                {CONTACT.phone}
              </a>
            )}

            {CONTACT.email && (
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex min-h-9 w-fit items-center text-[15px] hover:text-[var(--ttr-sec-gold)]"
              >
                {CONTACT.email}
              </a>
            )}

            <div className="mt-3 -ml-3 flex">
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-white/10 hover:text-[var(--ttr-sec-gold)]"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="border-t border-white/15 py-5 text-[13px] text-white/55">
          © {new Date().getFullYear()} TTR Banglamukhi Nursery
        </p>
      </div>
    </footer>
  );
}
