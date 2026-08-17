import { useState } from "react";
import { MessageCircle, Phone, Mail, Send } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
// TODO: Replace with the real Mxsmash Burger owner's number/handle before launch
const OWNER_WHATSAPP = "09135550449";
const OWNER_PHONE = "+234 9135550449";
const OWNER_INSTAGRAM = "mxsmash_ng";
const OWNER_EMAIL = "mxsmash84@gmail.com";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // Builds a WhatsApp message from the contact form instead of needing a separate
  // email backend - keeps things simple and consistent with the order flow
  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `New message from website\n\nName: ${form.name}\nEmail: ${form.email}\n\nMessage: ${form.message}`;
    const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us",
      href: `https://wa.me/${OWNER_WHATSAPP}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: OWNER_PHONE,
      href: `tel:${OWNER_PHONE.replace(/\s/g, "")}`,
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      value: OWNER_INSTAGRAM,
      href: `https://instagram.com/${OWNER_INSTAGRAM.replace("@", "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: OWNER_EMAIL,
      href: `mailto:${OWNER_EMAIL}`,
    },
  ];

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <span className="text-[#d4a437] font-bold tracking-[0.2em] uppercase text-xs">
          Get In Touch
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4">
          Contact Us
        </h1>
        <p className="text-gray-400 text-lg mb-12">
          We'd love to hear from you. Reach out anytime.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact methods */}
          <div className="space-y-4">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <a
                  href={method.href}
                  target={
                    method.label !== "Phone" && method.label !== "Email"
                      ? "_blank"
                      : undefined
                  }
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-[#d4a437]/30 transition-all"
                >
                  <div className="w-12 h-12 bg-[#d4a437]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#d4a437]" />
                  </div>
                  <div>
                    <p className="font-bold">{method.label}</p>
                    <p className="text-gray-400 text-sm">{method.value}</p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Quick message form */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4">Quick Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Your name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4a437]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4a437]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4a437] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#d4a437] text-black font-bold py-3.5 rounded-xl hover:bg-[#c4941f] transition"
              >
                <Send className="w-4 h-4" />
                Send via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
