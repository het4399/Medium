import { Auth2 } from "../components/Auth2";
import { Quote } from "../components/Quote";
import { motion } from "framer-motion";

export const Signin = () => {
  return (
    <div className="relative min-h-screen bg-[#121a2e] overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute w-[200px] md:w-[300px] lg:w-[350px] h-[200px] md:h-[300px] lg:h-[350px] bg-blue-600/30 rounded-full blur-[80px] md:blur-[100px] lg:blur-[120px] pointer-events-none"
          style={{ top: "5%", left: "5%" }}
          animate={{
            x: [0, 300, -200, 250, 0],
            y: [0, -150, 200, -200, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute w-[180px] md:w-[250px] lg:w-[300px] h-[180px] md:h-[250px] lg:h-[300px] bg-teal-500/30 rounded-full blur-[70px] md:blur-[90px] lg:blur-[100px] pointer-events-none"
          style={{ bottom: "10%", right: "10%" }}
          animate={{
            x: [0, -250, 150, -200, 0],
            y: [0, 120, -150, 150, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Auth Section - Takes full width on mobile, shares space on larger screens */}
          <div className="flex items-center justify-center bg-gradient-to-r bg-slate-800/10 text-white p-6 md:p-10 lg:p-12 w-full">
            <Auth2 />
          </div>
          {/* Quote Section - Visible only on large screens */}
          <div className="hidden lg:flex items-center justify-center p-6 bg-slate-900/10">
            <Quote />
          </div>
        </div>
      </div>
    </div>
  );
};
