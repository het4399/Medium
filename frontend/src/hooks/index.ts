import axios from "axios";
import { useEffect, useState } from "react";
import {BACKEND_URL} from "../config";

// Interface for a Blog object
export interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  publishedDate: string;
  author: {
    name: string;
    [x: string]: any;
  };
  likeCount: number;
  dislikeCount: number;
  [key: string]: any; // Allow additional properties
}

// Hook to fetch a single blog by ID
export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        setBlog(res.data.response);
        setLoading(false);
      });
  }, [id]);

  return { loading, blog };
};

// Hook to fetch multiple blogs for home
export const useBlogsHome = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`)
      .then((res) => {
        const noOfBlogs = res.data.blogs.map((blog: Blog) => ({
          ...blog,
          likeCount: blog._count.likes,
          dislikeCount: blog._count.dislikes,
        }));
        setBlogs(noOfBlogs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
      });
  }, []);
  return { loading, blogs };
};

// Hook to fetch multiple blogs
export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      })
      .then((res) => {
        const blogsWithCounts = res.data.blogs.map((blog: Blog) => ({
          ...blog,
          likeCount: blog._count.likes, // Extract like count
          dislikeCount: blog._count.dislikes, // Extract dislike count
        }));
        setBlogs(blogsWithCounts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
      });
  }, []);

  return { loading, blogs };
};

// Hook to fetch formatted publication dates for blogs
export const useDate = () => {
  const [dates, setDates] = useState<Record<string, string>>({});

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      })
      .then(({ data }) => {
        const blogs = data.blogs as Blog[];
        const dateMap = blogs.reduce((acc, blog) => {
          const date = blog.publishedDate || blog.createdAt;
          acc[blog.id] = date
            ? new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Unknown Date";
          return acc;
        }, {} as Record<string, string>);
        setDates(dateMap);
      })
      .catch((error) => {
        console.error("Error fetching dates:", error);
      });
  }, []);

  return { dates };
};

// Hook to handle like/dislike functionality
export function useLikeDislike(blogId: string) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const [isProcessingDislike, setIsProcessingDislike] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch like/dislike status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/blog/${blogId}`, {
          headers: { Authorization: localStorage.getItem("token") || "" },
        });
        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.isLiked);
          setIsDisliked(data.isDisliked);
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, [blogId]);

  // Handle like toggle
  const toggleLike = async () => {
    if (isProcessingLike || isProcessingDislike) return;
    setIsProcessingLike(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/blog/like/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") || "" },
      });
      if (response.ok) {
        setIsLiked((prev) => !prev);
        setIsDisliked(false);
      }
    } catch (error) {
      console.error("Error liking blog:", error);
    } finally {
      setIsProcessingLike(false);
    }
  };

  // Handle dislike toggle
  const toggleDislike = async () => {
    if (isProcessingLike || isProcessingDislike) return;
    setIsProcessingDislike(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/blog/dislike/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") || "" },
      });
      if (response.ok) {
        setIsDisliked((prev) => !prev);
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Error disliking blog:", error);
    } finally {
      setIsProcessingDislike(false);
    }
  };

  return { isLiked, isDisliked, toggleLike, toggleDislike, isLoading, isProcessingLike, isProcessingDislike };
}

interface User {
  name: string;
  email: string;
}

// Hook to fetch user profile details
export const useUserProfile = () => {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");

    // Ensure storedUser is neither null nor "undefined"
    if (storedUser && storedUser !== "undefined") {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user"); // Remove invalid data
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      setLoading(false);
      return; // Skip fetching if user is already stored
    }

    axios
      .get(`${BACKEND_URL}/api/v1/users/profile`, {
        headers: { Authorization: `${localStorage.getItem("token") || ""}` },
      })
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
        setLoading(false);
      });
  }, []);

  return { loading, user };
};

// Hook to change user account settings
interface UpdateSettingsData {
  name?: string;
  email?: string;
  password?: string;
}

interface UserSettings {
  name: string;
  email: string;
}

export const useSettings = () => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [settings, setSettings] = useState<UserSettings>({ name: "", email: "" });

  // Fetch user profile data to pre-populate the settings form
  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    axios
      .get(`${BACKEND_URL}/api/v1/users/profile`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        const user = res.data.user;
        setSettings({
          name: user.name ,
          email: user.email, // or user.email if needed
        });
        setSettingsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user settings:", err);
      });
  }, []);

  const updateSettings = async (data: UpdateSettingsData) => {
    setUpdateLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token") || "";
      await axios.put(`${BACKEND_URL}/api/v1/users/setting`, data, {
        headers: { Authorization: token },
      });
      setSuccess(true);
      // Update the local settings state so the form reflects the changes immediately
      setSettings((prev) => ({ ...prev, ...data }));
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.message ? err.response.data.message : "Failed to update settings";
      setError(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  return { updateSettings, updateLoading, settingsLoading, error, success, settings };
};

// Hook to delete user
export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteUser = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token") || "";
      const response = await axios.delete(`${BACKEND_URL}/api/v1/users/delete`, {
        headers: { Authorization: token },
      });
      setSuccess(true);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to delete user");
      } else {
        setError("Failed to delete user");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error, success };
};

// Hook to show site metrics
export const useMetrics = () => {
  const [metrics, setMetrics] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/metrics`, { responseType: "text" })
      .then((res) => {
        setMetrics(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load metrics");
        setLoading(false);
      });
  }, []);

  return { metrics, loading, error };
};
