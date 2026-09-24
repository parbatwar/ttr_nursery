function InstagramIcon({ size = 17 }) {
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

function FacebookIcon({ size = 17 }) {
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

function TikTokIcon({ size = 17 }) {
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

export default function Footer() {
  return (
    <footer className="bg-[var(--ttr-green-green-dark)] px-6 pb-8 pt-16 text-[#F4F0E8] sm:px-10 lg:px-16 lg:pt-20">
      <div className="mx-auto max-w-[var(--ttr-container)]">

        {/* TOP */}
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">

          {/* BRAND */}
          <div className="lg:col-span-5">

            {/* LOGO */}
            <div className="mb-7">
              <img
                src="/logo.png"
                alt="TTR Banglamukhi Nursery"
                className="h-24 w-auto object-contain sm:h-28 lg:h-32"
              />
            </div>

            <p className="pb-4 font-serif text-3xl leading-tight sm:text-4xl">
              TTR Banglamukhi Nursery
            </p>

            <p className="mt-4 max-w-sm text-sm leading-7 text-[#F4F0E8]/60">
              Plants, flowers and green spaces grown with patience in Nepal
              for more than twenty-five years.
            </p>
            
            {/* SOCIAL ICONS */}
            <div className="mt-8 flex items-center gap-4">

            <a
                href="https://www.instagram.com/ttrnursery"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F4F0E8]/15 text-[#F4F0E8]/60 transition-all duration-300 hover:-translate-y-1 hover:border-[#F4F0E8]/40 hover:text-[#F4F0E8]"
            >
                <InstagramIcon />
            </a>

            <a
                href="https://www.facebook.com/ttrnurseryNP"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F4F0E8]/15 text-[#F4F0E8]/60 transition-all duration-300 hover:-translate-y-1 hover:border-[#F4F0E8]/40 hover:text-[#F4F0E8]"
            >
                <FacebookIcon />
            </a>

            <a
                href="ttps://www.tiktok.com/@ttrnursery"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F4F0E8]/15 text-[#F4F0E8]/60 transition-all duration-300 hover:-translate-y-1 hover:border-[#F4F0E8]/40 hover:text-[#F4F0E8]"
            >
                <TikTokIcon />
            </a>

            </div>

          </div>

          {/* LINKS */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:col-span-7">

            {/* EXPLORE */}
            <div>
              <p className="mb-6 text-[9px] font-medium uppercase tracking-[0.24em] text-[#F4F0E8]/35 pb-4">
                Explore
              </p>

              <div className="space-y-4 text-sm text-[#F4F0E8]/65">
                <a
                  href="/products"
                  className="block transition-colors duration-300 hover:text-[#F4F0E8]"
                >
                  All Plants
                </a>

                <a
                  href="/products?category=indoor"
                  className="block transition-colors duration-300 hover:text-[#F4F0E8]"
                >
                  Indoor Plants
                </a>

                <a
                  href="/products?category=seasonal"
                  className="block transition-colors duration-300 hover:text-[#F4F0E8]"
                >
                  Outdoor Plants
                </a>

                <a
                  href="/products?category=pots"
                  className="block transition-colors duration-300 hover:text-[#F4F0E8]"
                >
                  Pots & Planters
                </a>

                <a
                  href="/#story"
                  className="block transition-colors duration-300 hover:text-[#F4F0E8]"
                >
                  Our Story
                </a>
              </div>
            </div>

            {/* SERVICES */}
            <div>
              <p className="mb-6 text-[9px] font-medium uppercase tracking-[0.24em] text-[#F4F0E8]/35 pb-4">
                Services
              </p>

              <div className="space-y-4 text-sm leading-5 text-[#F4F0E8]/65">
                <a
                  href="/services/landscape"
                  className="block transition-colors duration-300 hover:text-[#F4F0E8]"
                >
                  Landscape Design
                </a>

                <a
                  href="/services/plants-and-flowers"
                  className="block transition-colors duration-300 hover:text-[#F4F0E8]"
                >
                  Plants & Flowers
                </a>

                <a
                  href="/services/plant-rentals"
                  className="block transition-colors duration-300 hover:text-[#F4F0E8]"
                >
                  Plant Rentals
                </a>

                <a
                  href="/services/garden-care"
                  className="block transition-colors duration-300 hover:text-[#F4F0E8]"
                >
                  Garden Care
                </a>
              </div>
            </div>

            {/* VISIT */}
            <div className="col-span-2 sm:col-span-1 pb-4">
              <p className="mb-6 text-[9px] font-medium uppercase tracking-[0.24em] text-[#F4F0E8]/35">
                Visit
              </p>

              <div className="space-y-4 text-sm leading-6 text-[#F4F0E8]/65">
                <p>
                  Kathmandu
                  <br />
                  Nepal
                </p>

                <a
                  href="/contact"
                  className="block transition-colors duration-300 hover:text-[#F4F0E8]"
                >
                  Contact Us
                </a>

                <a
                  href="/cart"
                  className="block transition-colors duration-300 hover:text-[#F4F0E8]"
                >
                  Your Cart
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 text-[9px] uppercase tracking-[0.18em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} TTR Banglamukhi Nursery
          </p>
        </div>

      </div>
    </footer>
  );
}