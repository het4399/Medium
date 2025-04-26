import { Blog, useBlogsHome } from "../Hooks";
import { BlogCard } from "./BlogCard.tsx";
import { useEffect, useRef } from "react";

export const BlogSlider = () => {
    const { loading, blogs } = useBlogsHome();
    const sliderRef = useRef<HTMLDivElement | null>(null);

    // Sort blogs by likes-dislikes, then by newest
    const sortedBlogs = [...blogs].sort((a, b) => {
        // Compare likes first (higher likes first)
        const likeDiff = b.likeCount - a.likeCount;
        if (likeDiff !== 0) {
            return likeDiff;
        }

        // If likes are the same, compare dislikes (lower dislikes first)
        const dislikeDiff = a.dislikeCount - b.dislikeCount;
        if (dislikeDiff !== 0) {
            return dislikeDiff;
        }

        // If both likes and dislikes are the same, sort by date (newer first)
        const dateA = new Date(a.publishedDate || a.createdAt);
        const dateB = new Date(b.publishedDate || b.createdAt);
        return dateB.getTime() - dateA.getTime();
    });

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        let scrollAmount = 0;
        const speed = 1.2; // Adjust speed for smoother scrolling

        const scroll = () => {
            if (!slider) return;
            if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
                scrollAmount = 0;
                slider.scrollTo({ left: 0, behavior: "instant" });
            } else {
                scrollAmount += speed;
                slider.scrollLeft += speed;
            }
            requestAnimationFrame(scroll);
        };

        const animation = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animation);
    }, []);

    return (
        <section className="relative overflow-hidden py-9">
            {/* Featured Blogs Header */}
            <div className="text-center">
                <h1 className="text-3xl font-semibold text-white group inline-block cursor-auto">
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Featured Blogs
                        {/* Animated Underline */}
                        <div className="mx-auto mt-3 h-[3px] w-16 bg-cyan-400 rounded-full transition-all duration-300 ease-in-out group-hover:w-40 group-hover:block"></div>
                    </span>
                </h1>
            </div>

            {/* Blog Slider */}
            <div ref={sliderRef} className="flex space-x-6  overflow-x-auto no-scrollbar px-6 py-8">
                {loading ? (
                    <p className="text-gray-400 mx-auto">Loading blogs...</p>
                ) : (
                    <>
                        {sortedBlogs.slice(0, 5).map((blog: Blog) => (
                            <div key={blog.id} className="min-w-[320px] max-w-xs p-4 bg-[#131b2e] rounded-lg shadow-lg hover:shadow-xl transition">
                                <BlogCard
                                    id={blog.id}
                                    authorName={blog.author.name || "Anonymous"}
                                    title={blog.title}
                                    content={blog.content}
                                    publishedDate={""}
                                    likeCount={blog.likeCount}
                                    dislikeCount={blog.dislikeCount}
                                />
                            </div>
                        ))}

                        {/* Sign in / Sign up Card */}
                        <a
                            href="/signup"
                            className="min-w-[320px] max-w-xs p-6 bg-gradient-to-br from-[#1a2338] to-[#101828] rounded-lg shadow-lg flex flex-col items-center justify-center text-white text-center transition hover:scale-105 hover:shadow-xl"
                        >
                            <p className="text-lg font-semibold">Sign in or Sign up</p>
                            <p className="text-gray-400 text-sm mt-1">to explore more blogs</p>
                        </a>
                    </>
                )}
            </div>
            {/* Explore More Button */}
            <div className="flex justify-center">
                <a
                    href="/signin"
                    className="px-6 py-3 hover:shadow-[0_0_10px_1px] duration-200 hover:shadow-cyan-400/30 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-md transition hover:scale-110 focus:scale-100 "
                >
                    Explore More
                </a>
            </div>

        </section>
    );
};
