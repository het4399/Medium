import { motion } from "framer-motion";
import { AppBar2 } from "../components/AppBar2";

export const AboutUs = () => {
    return (
        <div className="bg-[#0f172a] min-h-screen text-gray-200">
            {/* AppBar for navigation */}
            <AppBar2 />

            <div className="flex justify-center pt-20 lg:pt-24 px-4">
                <div className="w-full max-w-6xl space-y-6 p-4 sm:p-5 lg:p-7 bg-[#15203a] rounded-xl">
                    {/* Main Content Container with Animation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="grid md:grid-cols-12 gap-6 p-5 lg:p-7 w-full max-w-6xl rounded-xl bg-[#23324a] border border-[#2e3978] backdrop-blur-md"
                    >
                        {/* Animated Content Section */}
                        <motion.div
                            initial={{ x: -60 }}
                            animate={{ x: 0 }}
                            transition={{ type: "spring", stiffness: 90, damping: 20 }}
                            className="md:col-span-12"
                        >
                            {/* Heading */}
                            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-100">
                                Welcome to <span className="text-indigo-400 font-extrabold">BlogBox!</span>
                            </h1>

                            {/* Description */}
                            <p className="mt-4 text-gray-300 leading-relaxed text-base max-w-6xl">
                                A platform built for passionate writers and readers alike. Here, you can create, read, update, and delete your blogs while engaging with a vibrant community through likes and dislikes. Our goal is to provide a seamless and interactive blogging experience for everyone.
                            </p>

                            <p className="mt-4 text-gray-300 leading-relaxed text-base max-w-6xl">
                                BlogBox was created by <span className="text-indigo-400 font-bold">Het Sojitra</span>, a developer passionate about building meaningful digital experiences. If you're interested in the source code, feel free to check out the project on GitHub. 🚀
                            </p>

                            {/* Profile and GitHub Link */}
                            <div className="mt-6 flex items-center space-x-4">
                                <img src="/me.jpg" alt="Het Sojitra" className="w-20 h-20 rounded-full border border-indigo-500" />
                                <a
                                    href="https://github.com/het4399/Medium"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 font-semibold hover:underline"
                                >
                                    GitHub Repository
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};