// Fill these in once, and the WhatsApp button, footer and Contact page all update.
// Anything left blank stays hidden, so no wrong details can appear on the site.
export const CONTACT = {
  // Numbers only, with the country code. Example format: 97798XXXXXXXX
  whatsappNumber: "",
  phone: "",
  email: "",
  address: "Kathmandu, Nepal",
  hours: "",
  // The "src" link from Google Maps > Share > Embed a map.
  mapEmbedUrl: "",
};

export function getWhatsAppLink() {
  if (!CONTACT.whatsappNumber) return "";

  const message = encodeURIComponent("Hello TTR Nursery, I have a question about ");
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${message}`;
}
