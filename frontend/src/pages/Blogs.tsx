import { useNavigate, Link } from "react-router-dom";
import { Appbar } from "../components/Appbar"
import { BlogCards } from "../components/BlogCards"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs, Blog } from "../hooks";
import { useEffect } from "react";

export function Blogs() {
    const { loading, blogs } = useBlogs();
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem("token")) navigate("/");
    }, [navigate]);
    if (loading) {
        return <div>
            <div className="bg-[#0f172a] min-h-screen text-gray-200">
                <Appbar />
                <div className="flex justify-center pt-20 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8 bg-[#15203a] rounded-2xl">

                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />

                    </div>
                </div>
            </div>
        </div>
    }
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

    return <>


        <div className="bg-[#0f172a] min-h-screen text-gray-200">
            <Appbar />
            <div className="flex justify-center pt-20 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8 bg-[#15203a] rounded-2xl">

                    {sortedBlogs.map((blog: Blog) => {

                        // Format published date or fallback to 'Unknown Date'
                        const publishedDate = blog.publishedDate
                            ? new Date(blog.publishedDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                            : (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Unknown Date");
                        return (
                            <div key={blog.id}>
                                <BlogCards
                                    id={blog.id}
                                    authorName={blog.author.name || "Anonymous"}
                                    title={blog.title}
                                    content={blog.content}
                                    publishedDate={publishedDate}
                                    likeCount={blog.likeCount}
                                    dislikeCount={blog.dislikeCount} />
                            </div>)
                    })}
                </div>
            </div >
            <div className="flex justify-center items-center space-x-2 text-xs text-gray-300 py-6 opacity-80">
                <div className="pointer-events-none">
                    <span>Created by Het Sojitra on Jan 14, 2025</span>
                </div>
                <Link to="/about">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 text-indigo-200 transition duration-300 hover:scale-110 hover:text-indigo-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                </Link>
            </div>
        </div>

    </>
}
