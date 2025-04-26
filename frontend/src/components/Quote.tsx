import { motion } from "framer-motion";

export function Quote() {
    return <>
        <motion.div
            className="text-center max-w-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }} // Smooth hover effect
        >
            <blockquote className="text-3xl font-semibold leading-relaxed text-gray-100">
                Turn your voice into a force. Change begins with you.            </blockquote>

            {/* Author attribution */}
            <div className="mt-4 text-lg font-bold text-indigo-400">Anonymous</div>
            <div className="text-gray-400 text-sm">Blogger & Thinker</div>


        </motion.div>
    </>
};

