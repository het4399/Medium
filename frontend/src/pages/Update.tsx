import { useNavigate, useParams } from "react-router-dom";
import { useBlog } from "../hooks";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Appbar } from "../components/Appbar";
import { Edit } from "./Edit"
import { useEffect } from "react";

export const Update = () => {
    const { id } = useParams(); // Get blog ID from URL params
    const { loading, blog } = useBlog({ id: id || "" }); // Fetch blog data
    const navigate = useNavigate();

    // Redirect to login if user is not logged in
    useEffect(() => {
        if (!localStorage.getItem("token")) navigate("/");
    }, [navigate]);

    // Show loading spinner while fetching data
    if (loading) {
        return (
            <div>
                <Appbar />
                <div className="min-h-screen bg-[#0f172a] text-gray-200 flex flex-col">
                    <div className="flex flex-grow justify-center items-center">
                        <LoadingSpinner />
                    </div>
                </div>
            </div>
        );
    }

    // Show message if blog is not found
    if (!blog) {
        return <div>Blog not found</div>;
    }

    // Render the Edit component with blog data
    return (
        <div>
            <Edit blog={blog} />
        </div>
    );
};
