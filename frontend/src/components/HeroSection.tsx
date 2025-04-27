import { Link } from "react-router-dom";
import { RefObject } from "react";
import { FloatingCard } from "./FloatingCard";
import { TypewriterHero } from "./ui/TypeWriter";
import { Blob_Home } from "./ui/BlobBackground";


interface HeroSectionProps {
    blogSliderRef: RefObject<HTMLDivElement | null>;
}
export default function HeroSection({ blogSliderRef }: HeroSectionProps) {

    const scrollToBlogs = () => {
        if (blogSliderRef?.current) {
            blogSliderRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (<>
        <div className="relative z-10 min-h-screen w-full overflow-hidden rounded-lg border border-border/40 bg-background/50 backdrop-blur-xs">
            <div className="absolute inset-0 z-10 flex items-center justify-center">
                <Blob_Home />
            </div>

            <div className="z-5 flex flex-col items-center text-center justify-center min-h-screen">
                {/* Animated Heading */}
                <TypewriterHero
                    title="Your"
                    description="Begin sharing your ideas with the world through blogging, where it's easy, expressive, and powerful to connect and inspire."
                    words={["Narrative", "Opinion", "Stage"]}
                    typingSpeed={80}
                    deletingSpeed={40}
                    pauseDuration={2000}
                />
                {/* Call to Action Buttons */}
                <div className="mt-4 md:mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 text-center z-10">
                    {/* Button 1: Start Writing */}
                    <Link
                        to="/signup"
                        className=" px-5 md:px-6 py-2 md:py-3 focus:hover:scale-100 bg-gradient-to-br hover:from-cyan-600 hover:to-indigo-600 from-cyan-600/90 to-indigo-600/90 rounded-lg md:rounded-xl text-white font-semibold text-base md:text-lg shadow-md transition-transform duration-300 hover:scale-110 flex items-center justify-center"
                    >
                        Start Writing
                    </Link>

                    {/* Button 2: Explore Blogs */}
                    <button
                        onClick={scrollToBlogs}
                        className="px-5 md:px-6 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:scale-100 text-gray-300 font-semibold text-base md:text-lg shadow-md transition-transform duration-300 hover:bg-white-700/40 hover:text-white hover:scale-110 flex items-center justify-center"
                    >
                        Explore Blogs
                    </button>
                </div>
            </div>



            {/* Floating Cards */}
            <FloatingCard
                title="Write Your Ideas"
                content="Express your thoughts freely."
                className="top-20 md:top-15 left-10 md:left-40 z-15"
                movementPattern={{ x: [0, 20, -30, 15, -10, 0], y: [0, -15, 20, -10, 5, 0] }}
                rotation={-10}
            />

            <FloatingCard
                title="Build Community"
                content="Connect with like-minded people."
                className="top-10 md:top-20 right-20 md:right-80 pl-8 pt-3 z-15"
                movementPattern={{ x: [0, 25, -10, 15, -20, 0], y: [0, -20, 10, -15, 5, 0] }}
                rotation={6}
            />

            <FloatingCard
                title="Inspire Others"
                content="Your words can make a difference."
                className="bottom-10 md:bottom-30 left-20 md:left-80 z-15"
                movementPattern={{ x: [0, -10, 15, -20, 25, -15, 0], y: [0, 20, -10, 15, -5, 0] }}
                rotation={8}
            />

            <FloatingCard
                title="Share Your Knowledge"
                content="Help others by sharing insights."
                className="bottom-20 md:bottom-40 right-10 md:right-20 pt-5 z-15"
                movementPattern={{ x: [0, -15, 25, -10, 5, 0], y: [0, 10, -20, 15, -10, 0] }}
                rotation={-12}
            />

            {/* Content Wrapper */}

        </div>
    </>
    );
}
