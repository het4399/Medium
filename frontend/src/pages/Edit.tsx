import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
import { motion, AnimatePresence } from "framer-motion";

interface Blog {
    id: string;
    title?: string;
    content?: string;
}

export const Edit = ({ blog }: { blog: Blog }) => {
    const [title, setTitle] = useState(blog.title || "");
    const [content, setContent] = useState(blog.content || "");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);   
    const [isPublishing, setIsPublishing] = useState(false);
    const { id } = blog;
    const navigate = useNavigate();

    // Handle error message fading effect
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    // Fetch blog details if not provided initially
    useEffect(() => {
        if (!blog.title || !blog.content) {
            const fetchBlog = async () => {
                try {
                    const { data } = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                        headers: { Authorization: localStorage.getItem("token") },
                    });
                    setTitle(data.title);
                    setContent(data.content);
                } catch (error) {
                    console.error("Error fetching blog details:", error);
                    setErrorMessage("Failed to fetch blog details.");
                }
            };
            fetchBlog();
        }
    }, [id, blog]);

    // Handle blog update
    const handleUpdate = async () => {
        setIsPublishing(true);
        try {
            await axios.put(`${BACKEND_URL}/api/v1/blog/update/${id}`, { title, content }, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            navigate(`/blog/${id}`);
        } catch (error) {
            console.error("Error updating blog:", error);
            setErrorMessage("Access denied: You do not have permission to update this blog.");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-gray-200">
            <Appbar />
            <div className="flex justify-center w-full pt-20 lg:pt-24 px-4">
                <div className="w-full max-w-3xl space-y-6 p-4 sm:p-5 lg:p-7 bg-[#15203a] rounded-xl">
                    {/* Inner card with sliding effect */}
                    <motion.div
                        initial={{ x: -60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 90, damping: 20 }}
                        className="w-full max-w-screen-lg bg-[#23324a] p-5 rounded-xl shadow-lg backdrop-blur-md"
                    >
                        {/* Page heading and description */}
                        <div className="mb-7 mt-1 text-center">
                            <h1 className="text-2xl md:text-3xl font-bold">Edit Blog</h1>
                            <p className="text-xs md:text-sm text-gray-400 mt-1">
                                Update your title and content below.
                            </p>
                        </div>
                        {/* Error Message */}
                        <AnimatePresence>
                            {errorMessage && (
                                <motion.div
                                    key="errorMessage"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-red-600 text-white text-sm p-3 rounded-lg mb-4"
                                >
                                    {errorMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Title Input */}
                        <input value={title || ""} onChange={(e) => setTitle(e.target.value)} placeholder="Title"
                            className="bg-[#1e2b40] border border-[#2e3978] text-gray-300 rounded-lg w-full p-3 focus:outline-none"
                        />

                        {/* Content Input */}
                        <textarea value={content || ""} onChange={(e) => setContent(e.target.value)} placeholder="Content"
                            className="border border-[#2e3978] rounded-lg focus:outline-none block w-full text-gray-300 bg-[#1e2b40] p-3 h-56 mt-4 resize-none"
                        />

                        {/* Action Buttons */}
                        <div className="flex space-x-4 w-full sm:w-auto justify-center sm:justify-start mt-5">
                            <button onClick={handleUpdate} className={`bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 w-full flex justify-center 
                            ${isPublishing ? "cursor-not-allowed opacity-70" : ""}`}>
                                {isPublishing ? (
                                    <>
                                        <svg className="animate-spin size-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 16 0h-2a6 6 0 1 0-12 0H4z"
                                            ></path>
                                        </svg>
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                        </svg>
                                        <span>Update</span>
                                    </>
                                )}
                            </button>

                            
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
