import { MessageCircle } from "lucide-react";

// Owner's WhatsApp number (international format, no + or spaces)
const OWNER_WHATSAPP = "2349135550449"; // Replace with real number

const WhatsAppButton = ({ message }) => {
  // Use the cust om message if provided, otherwise fallback to generic greeting
  const finalMessage = message || "Hi Mxsmash Burger! I'd like to place an order.";
  const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(finalMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[90] w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] transition-all group"
    >
      <MessageCircle className="w-7 h-7 md:w-8 md:h-8 fill-white group-hover:rotate-12 transition-transform" />
      <span className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block shadow-xl">
        Chat with us!
      </span>
    </a>
  );
};

export default WhatsAppButton;