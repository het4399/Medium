import { useState } from "react";
import { FaPenNib } from "react-icons/fa";

export const ExpressYourselfCard = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full flex flex-col md:flex-row items-center bg-gradient-to-r from-blue-900/40 to-blue-700/50 p-10 shadow-lg backdrop-blur-md overflow-hidden transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)} // Enable animations on touch
      onTouchEnd={() => setIsHovered(false)} // Reset state on touch end
    >
      {/* Floating Background Effect */}
      <div
        className={`absolute top-10 left-0.5 w-24 h-24 bg-yellow-400 rounded-full blur-xl transition-transform duration-700 ${isHovered ? "translate-x-1 -translate-y-8 opacity-30" : "opacity-20"
          }`}
      ></div>

      {/* Left Side: Icon and Main Content */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-3">
          <FaPenNib
            className={`text-3xl transition-all duration-300 ${isHovered ? "text-yellow-300 scale-110" : "text-yellow-400"
              }`}
          />
          <h2 className="text-3xl font-semibold text-white transition-all duration-300">
            Express Yourself
          </h2>
        </div>
        <p
          className={`mt-4 text-lg transition-all duration-300 ${isHovered ? "text-gray-200" : "text-gray-300"
            }`}
        >
          Writing blogs lets you share your thoughts, ideas, and experiences.
          Whether it's storytelling or informative content, your words have power.
        </p>
        {/* Additional Content that appears on hover */}
        <div
          className={`mt-6 transition-all duration-500 transform ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          <p className="text-md text-gray-200">Discover how blogging can:</p>
          <ul className="list-disc list-inside text-gray-200 mt-2">
            <li>Boost your creativity and writing skills</li>
            <li>Establish your online presence</li>
            <li>Share your thoughts with the world</li>
          </ul>
        </div>
      </div>

      {/* Right Side: Interactive Floating Elements */}
      <div className="relative flex-1 flex justify-end items-center space-x-4">
        <div
          className={`w-20 h-20 bg-blue-400/30 rounded-lg shadow-md transition-all duration-500 ${isHovered ? "translate-y-2 scale-105 shadow-xl" : "scale-100"
            }`}
        ></div>
        <div
          className={`w-16 h-16 bg-yellow-300/40 rounded-lg shadow-md transition-all duration-500 ${isHovered ? "-translate-y-2 scale-110 shadow-lg" : "scale-100"
            }`}
        ></div>
        {/* Extra Floating Element for more interactivity */}
        <div
          className={`w-12 h-12 bg-green-400/30 rounded-full transition-transform duration-500 ${isHovered ? "rotate-12 scale-110" : "rotate-0"
            }`}
        ></div>
      </div>
    </div>
  );
};

