import { Link } from "react-router-dom";
import { Flame, Award, Clock, Heart } from "lucide-react";

const About = () => {

  // const teamMembers = [
  //   {
  //     name: "Jaiye",
  //     role: "Founder & Head Chef",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jaiye",
  //   },
  //   {
  //     name: "Simi",
  //     role: "Operations Lead",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Simi",
  //   },
  //   {
  //     name: "Tunde",
  //     role: "Head of Delivery",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde",
  //   },
  //   {
  //     name: "Adeola",
  //     role: "Kitchen Manager",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adeola",
  //   },
  //   {
  //     name: "Chidi",
  //     role: "Quality Control",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chidi",
  //   },
  //   {
  //     name: "Ngozi",
  //     role: "Customer Experience",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ngozi",
  //   },
  // ];

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        {/* ========== GET TO KNOW US ========== */}
        <div className="text-center mb-16">
          <span className="text-[#d4a437] font-bold tracking-[0.2em] uppercase text-xs">
            Get to Know Us
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-3 mb-6 leading-tight">
            Built for Speed, Quality &{" "}
            <span className="text-[#d4a437]">Repeat-Worthy Combos</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Mxsmash Burger is a premium delivery-first burger brand built in the
            heart of Lekki. We're here to prove that fast food can be premium,
            fresh, and unforgettable — every single time.
          </p>
        </div>

        {/* ========== VALUES / FEATURES ========== */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-[#d4a437]/30 transition-all">
            <Flame className="w-8 h-8 text-[#d4a437] mb-3" />
            <h3 className="font-bold text-lg mb-2">Hand-Smashed</h3>
            <p className="text-gray-400 text-sm">
              Every patty is hand-pressed and smashed fresh for that signature
              crust — no shortcuts, no frozen puck.
            </p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-[#d4a437]/30 transition-all">
            <Award className="w-8 h-8 text-[#d4a437] mb-3" />
            <h3 className="font-bold text-lg mb-2">Quality First</h3>
            <p className="text-gray-400 text-sm">
              Fresh ingredients, house-made sauces, and combos worth repeating —
              no compromises on what goes into your food.
            </p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-[#d4a437]/30 transition-all">
            <Clock className="w-8 h-8 text-[#d4a437] mb-3" />
            <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
            <p className="text-gray-400 text-sm">
              We deliver across Lekki in 30–45 minutes, so your burger arrives
              hot and fresh, not lukewarm.
            </p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-[#d4a437]/30 transition-all">
            <Heart className="w-8 h-8 text-[#d4a437] mb-3" />
            <h3 className="font-bold text-lg mb-2">Made With Love</h3>
            <p className="text-gray-400 text-sm">
              We're a small, growing team obsessed with getting every order
              right — from the kitchen to your door.
            </p>
          </div>
        </div>

        {/* ========== TEAM / CREW SECTION WITH AVATARS ========== */}
        <div className="text-center mb-12">
          <span className="text-[#d4a437] font-bold tracking-[0.2em] uppercase text-xs">
            Meet the Team
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 mb-4">
            CHOP LIFE CREW <span className="text-[#d4a437]">(JAIYE X2)</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            …and an inspiring team that lives by the{" "}
            <span className="text-[#d4a437] font-bold">"Chop Life"</span>{" "}
            mantra.
          </p>
          <p className="text-gray-500 text-sm mt-2 italic">
            "Chop life" — meaning "enjoy life to the fullest" in Nigerian
            Pidgin.
          </p>
        </div>

        {/* Founder spotlight */}
        <div className="flex justify-center mb-16">
          <div className="flex flex-col items-center bg-white/5 border border-white/5 rounded-2xl p-8 hover:border-[#d4a437]/30 transition-all hover:bg-white/10 max-w-xs">
            <img
              src="/founder.jpeg"
              alt="Mr Moshood Ade Balogun"
              className="w-32 h-32 rounded-full object-cover border-2 border-[#d4a437]/30 mb-4"
            />
            <h4 className="font-bold text-white text-lg">
              Mr Moshood Ade Balogun
            </h4>
            <p className="text-gray-400 text-sm text-center mt-1">Founder</p>
          </div>
        </div>

        {/* ========== FLEXIBLE ORDERING (FOOD-FOCUSED) ========== */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-8 mb-12 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Order your way — pay how you like.
          </h3>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Choose from secure online payments, or pay with cash on delivery.
            Fast, flexible, and built for your convenience.
          </p>
        </div>

        {/* ========== CTA ========== */}
        <div className="text-center">
          <Link
            to="/menu"
            className="inline-block bg-[#d4a437] text-black font-bold px-8 py-3.5 rounded-full hover:bg-[#c4941f] transition shadow-xl hover:scale-105 active:scale-95"
          >
            Explore Our Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
