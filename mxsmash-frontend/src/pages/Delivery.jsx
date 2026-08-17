import { Clock, MapPin, MessageCircle } from "lucide-react";

const DELIVERY_ZONES = [
  { area: "Lekki Phase 1", time: "30-40 min" },
  { area: "Chevron", time: "30-45 min" },
  { area: "Ikate", time: "35-45 min" },
  { area: "Victoria Island", time: "40-55 min" },
];

const Delivery = () => {
  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white">
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Delivery Info</h1>
        <p className="text-gray-400 mb-10">
          We deliver fresh, hot smash burgers across Lekki and nearby areas.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {DELIVERY_ZONES.map((zone, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/5 rounded-2xl p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-[#d4a437]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#d4a437]" />
              </div>
              <div>
                <p className="font-bold">{zone.area}</p>
                <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  {zone.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex items-start gap-4">
          <MessageCircle className="w-6 h-6 text-[#d4a437] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-1">How payment works</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              After placing your order, you'll be redirected to WhatsApp to
              confirm your order and complete payment directly with us.
              Your order status will update once payment is confirmed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;