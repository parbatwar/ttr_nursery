import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "../lib/contact";

const buttonStyle =
  "fixed bottom-4 right-4 z-40 flex h-14 items-center gap-2 rounded-full bg-[#128c4a] px-4 font-semibold text-white shadow-[0_10px_28px_rgba(24,35,27,0.28)] transition hover:-translate-y-0.5 hover:bg-[#0f763e] lg:bottom-6 lg:right-6";

export default function WhatsAppButton() {
  const whatsappLink = getWhatsAppLink();

  const content = (
    <>
      <MessageCircle size={24} strokeWidth={1.8} />
      <span className="hidden sm:inline">Chat with us</span>
    </>
  );

  // Until a WhatsApp number is added, the button opens the Contact page.
  if (!whatsappLink) {
    return (
      <Link to="/contact" aria-label="Contact us" className={buttonStyle}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={buttonStyle}
    >
      {content}
    </a>
  );
}
