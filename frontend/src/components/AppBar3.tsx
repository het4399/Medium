import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


export const AppBar3 = () => {
    const [isScrolled, setIsScrolled] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Function to scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <motion.nav
            className={`w-full fixed top-0 z-50 flex items-center justify-between px-3 py-3 transition-all duration-300
                ${isScrolled ? "bg-[#172130]/80 backdrop-blur-lg shadow-md" : "bg-transparent"}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Logo and Branding */}
            <div className="flex items-center cursor-pointer" onClick={scrollToTop}>
                <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="w-10 h-10 object-contain"
                />
                <span
                    className={`text-xl font-bold tracking-wide ${isScrolled ? "text-indigo-400" : "bg-gradient-to-b from-blue-600/95 via-blue-200 to-white/90 bg-clip-text text-transparent"
                        } transition-all duration-300`}
                >
                    BlogBox
                </span>
            </div>
            {/* <ThemeToggle /> */}
            {/* Dynamic Button */}
            <Link
                to={isScrolled ? "/signup" : "/signin"}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-300 ${isScrolled
                    ? "bg-indigo-600 hover:scale-110 focus:scale-100 hover:bg-indigo-700 text-white"
                    : " text-white text-lg underline-offset-4 relative inline-block after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
                    }`}
            >
                {isScrolled ? <span>SIGN <span className="font-normal">UP</span></span> : <span>SIGN <span className="font-normal">IN</span></span>}
            </Link>
        </motion.nav>
    );
};
