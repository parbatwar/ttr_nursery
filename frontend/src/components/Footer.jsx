import { Link } from "react-router-dom";
import SocialLinks from "./SocialLinks";
import { CONTACT } from "../lib/contact";

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
      { name: "Contact Us", to: "/contact" },
    ],
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

            {CONTACT.email && (
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex min-h-9 w-fit items-center text-[15px] hover:text-[var(--ttr-sec-gold)]"
              >
                {CONTACT.email}
              </a>
            )}

            <SocialLinks
              className="mt-3 -ml-3"
              linkClassName="hover:bg-white/10 hover:text-[var(--ttr-sec-gold)]"
            />
          </div>
        </div>

        <p className="border-t border-white/15 py-5 text-[13px] text-white/55">
          © {new Date().getFullYear()} TTR Banglamukhi Nursery
        </p>
      </div>
    </footer>
  );
}
