import { Appbar } from "../components/Appbar";
import { FullBlog } from "../components/FullBlog";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useBlog } from "../hooks";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// atomFamilies/selectorFamilies
export const Blog = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem("token")) navigate("/");
    }, [navigate]);
    const { id } = useParams();
    const { loading, blog } = useBlog({
        id: id || ""
    });

    if (loading) {
        return (
            <div>
                <Appbar />
                <div className="min-h-screen bg-[#0f172a] text-gray-200 flex flex-col justify-center items-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }
    // Show message if the blog is not found
    if (!blog) {
        return <div>Blog not found</div>;
    }

    return <div>
        <FullBlog blog={blog} />
    </div>
}