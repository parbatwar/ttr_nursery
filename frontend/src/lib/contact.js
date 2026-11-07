// Fill these in once, and the WhatsApp button, footer and Contact page all update.
// Anything left blank stays hidden, so no wrong details can appear on the site.
export const CONTACT = {
  // Numbers only, with the country code. Example format: 97798XXXXXXXX
  whatsappNumber: "",
  phone: "984-1302920",
  email: "ttrnursery@gmail.com",
  address: "Shivachowk, Nakhipot, Lalitpur",
  hours: "7 AM – 6 PM",
  // The location shown on the Contact page map.
  mapEmbedUrl: "https://maps.google.com/maps?q=TTR%20Banglamukhi%20Nursery%2C%20Lalitpur&z=17&output=embed",
  // Opens the nursery's Google Maps listing, where visitors can get directions.
  directionsUrl: "https://maps.app.goo.gl/m7YamYyV5a4KbeEx5",
};

export function getWhatsAppLink() {
  if (!CONTACT.whatsappNumber) return "";

  const message = encodeURIComponent("Hello TTR Nursery, I have a question about ");
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${message}`;
}
