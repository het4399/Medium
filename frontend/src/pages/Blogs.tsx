import { Appbar } from "../components/Appbar"
import { BlogCards } from "../components/BlogCards"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";
export function Blogs() {
    const { loading, blogs } = useBlogs();
    if (loading) {
        return <div>
            <Appbar />
            <div className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />

                </div>
            </div>
        </div>
    }
    return <><div>

        <Appbar />
        <div className="flex justify-center">
            <div>
                {blogs.map(blog => <BlogCards
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={"2nd Feb 2024"}
                />)}
            </div>
        </div >
    </div>
    </>
}
