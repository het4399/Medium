import { motion } from "framer-motion";
import { Avatar } from "../components/BlogCard";
import { Blog, useBlogs, useUserProfile } from "../hooks";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Appbar } from "../components/Appbar";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { loading: profileLoading, user } = useUserProfile();
  const { loading: blogsLoading, blogs } = useBlogs();
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const navigate = useNavigate();

  // Redirect to login if user is not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token || token === "undefined" || token.trim() === "") {
      navigate("/");
    }
  }, [navigate]);
  

  useEffect(() => {
    if (!blogsLoading && user) {
      // Filter blogs where the blog author's name matches the current user's name
      const filteredBlogs = blogs.filter(
        (blog: Blog) => blog.author.name === user.name
      );
      setUserBlogs(filteredBlogs);
    }
  }, [blogs, blogsLoading, user]);

  if (profileLoading || blogsLoading) {
    return (
      <div className="bg-[#0f172a] min-h-screen text-gray-200 flex flex-col">
        <Appbar />
        <div className="flex-grow flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#0f172a] min-h-screen text-gray-200 flex flex-col justify-center items-center">
        <Appbar />
        <p>Error fetching user profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a] min-h-screen text-gray-200">
      <Appbar />
      <div className="flex justify-center pt-20 px-4">
        <div className="w-full max-w-4xl space-y-6 p-4 sm:p-5 lg:p-7 bg-[#15203a] rounded-2xl shadow-lg">
          {/* Fade in animation for profile card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="p-5 w-full rounded-xl bg-[#23324a] border border-[#2e3978] backdrop-blur-md"
          >
            {/* Slide in animation for content */}
            <motion.div
              initial={{ x: -60 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
            >
              {/* Page heading and description */}
              <div className="mb-9 mt-1 text-start">
                <h1 className="text-2xl md:text-3xl font-bold">User Profile</h1>
                <p className="text-xs md:text-sm text-gray-400 mt-1">
                  Explore your personalized blogs and contact info
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-2">
                {/* Profile Picture and Bio */}
                <div className="flex flex-col items-center justify-center">
                  <Avatar size="big" name={user.name} />
                  <h1 className="text-2xl font-bold mt-1">{user.name}</h1>
                </div>

                {/* Featured Posts and Contact */}
                <div className="space-y-4">
                  {/* Featured Posts */}
                  <div>
                    <h2 className="text-lg font-semibold mb-3 border-b pb-2 border-gray-700">
                      Featured Posts
                    </h2>
                    <ul className="space-y-4">
                      {userBlogs.length > 0 ? (
                        userBlogs.map((blog) => (
                          <motion.li
                            key={blog.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 bg-[#19263d] rounded-lg transition transform hover:bg-[#172237]"
                          >
                            <a href={`/blog/${blog.id}`} className="block truncate">
                              <p className="text-base font-medium">{blog.title}</p>
                            </a>
                          </motion.li>
                        ))
                      ) : (
                        <li className="p-4 bg-[#19263d] rounded-lg">
                          <p className="text-base">No blogs uploaded.</p>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Contact Information */}
                  <div className="pb-2">
                    <h2 className="text-lg font-semibold mb-3 border-b pb-2 border-gray-700">
                      Contact
                    </h2>
                    <p className="text-gray-400">Email:{" "}<a className="hover:underline text-gray-200">{user.email}</a></p>
                  </div>

                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};
