import { Appbar } from "../components/Appbar"
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
import { useNavigate } from "react-router-dom";
import { useEffect, useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useBlogs } from "../hooks";


export const Publish = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();
    const [isPublishing, setIsPublishing] = useState(false);
    const { loading } = useBlogs();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    useEffect(() => {
        if (!localStorage.getItem("token")) navigate("/");
    }, [navigate]);
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-gray-200 flex flex-col">
                <Appbar />
                <div className="flex flex-grow justify-center items-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }
    const handlePublish = async () => {
        if (!title || !content) {
            setErrorMessage("Title and content are required to publish the post.");
            return;
        }
        if (title.length < 10) {
            setErrorMessage("Title must be at least 10 characters long.");
            return;
        }
        if (content.length < 24) {
            setErrorMessage("Content must be at least 24 characters long.");
            return;
        }
        setIsPublishing(true);
        try {
            const res = await axios.post(
                `${BACKEND_URL}/api/v1/blog`,
                { title, content },
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            navigate(`/blog/${res.data.response}`);
        } catch (e) {
            console.error("Error creating blog post:", e);
            alert("Failed to publish the post. Please try again.");
        } finally {
            setIsPublishing(false);
        }
    }
    return <div>
        <div className="min-h-screen bg-[#0f172a] text-gray-200">

            <Appbar />
            <div className="flex justify-center pt-20 lg:pt-24 px-4">
                <div className="w-full max-w-3xl space-y-6 p-4 sm:p-5 lg:p-7 bg-[#15203a] rounded-xl">
                    <motion.div
                        initial={{ x: -60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 90, damping: 20 }}
                        className="w-full max-w-3xl bg-[#23324a] backdrop-blur-md p-5 sm:p-8 rounded-xl shadow-lg"
                    >
                        <div className="mb-7 mt-1 text-center">
                            <h1 className="text-2xl md:text-3xl font-bold">Publish Blog</h1>
                            <p className="text-xs md:text-sm text-gray-400 mt-1">
                                Share your insights, news, or stories with our community.
                            </p>
                        </div>
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
                        <input onChange={(e) => {
                            setTitle(e.target.value)
                        }} type="text" className="w-full p-3 bg-[#1e2b40] border border-[#2e3978] text-gray-200 rounded-lg focus:outline-none placeholder-gray-400" placeholder="Title" />

                        <TextEditor onChange={(e) => setContent(e.target.value)} />

                        <button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className={`mt-4 w-full py-3 font-semibold rounded-lg shadow-md transition-all duration-300 focus:ring-2 focus:ring-blue-500 flex items-center justify-center space-x-2 
                                ${isPublishing ? "bg-blue-800 hover:bg-blue-800 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 text-white"}`}>
                            {isPublishing ? (
                                <>
                                    <svg className="animate-spin size-5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 16 0h-2a6 6 0 1 0-12 0H4z"
                                        ></path>
                                    </svg>
                                    <span>Publishing...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l18-9-9 18-2.5-6.5L3 12z"
                                        />
                                    </svg>
                                    <span>Publish</span>
                                </>
                            )}
                        </button>
                    </motion.div>

                </div>
            </div>
        </div>
    </div>
}


function TextEditor({ onChange }: { onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) {
    return <div className="mt-2">
        <div className="w-full mb-4 ">
            <textarea onChange={onChange} rows={8} placeholder="Write an article..." required
                className="w-full p-3 bg-[#1e2b40] border border-[#2e3978] text-gray-200 rounded-lg focus:outline-none placeholder-gray-400 resize-none"
            />
        </div>
    </div>

}