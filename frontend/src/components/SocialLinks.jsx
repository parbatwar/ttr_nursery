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

// Used by the footer and the Contact page. Each one passes its own link style.
export default function SocialLinks({ className = "", linkClassName = "" }) {
  return (
    <div className={`flex ${className}`}>
      {SOCIAL_LINKS.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className={`grid h-11 w-11 place-items-center rounded-full transition-colors ${linkClassName}`}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
