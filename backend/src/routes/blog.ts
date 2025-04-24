import { PrismaClient } from "@prisma/client/edge";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { withAccelerate } from "@prisma/extension-accelerate";
import { CreateBloginput, UpdateBloginput, UpdateBlogInput } from "@het4399/common";
export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_secret: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authorization = c.req.header("authorization");
  if (!authorization) {
    c.status(401);
    return c.json({ message: "Missing authorization header" });
  }
  const token = authorization;

  try {
    const user = await verify(token, c.env.JWT_secret);
    if (user) {
      c.set("userId", user.id as string);
      await next();
    } else {
      c.status(403);
      return c.json({ message: "Invalid token" });
    }
  } catch (err) {
    c.status(403);
    return c.json({ message: "You are not Logged In" });
  }
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { success, error } = CreateBloginput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ message: error.toString() });
  }
  const userId = c.get("userId");
  try {
    const response = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    });
    c.status(200);
    return c.json({ response: response.id });
  } catch (e) {
    console.error("Error creating blog post: ", e);
    c.status(500);
    return c.json({ message: "Error creating blog post" });
  }
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const { success, error } = UpdateBloginput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ message: error.toString() });
  }
  const userId = c.get("userId");
  const response = await prisma.blog.update({
    where: { id: body.id },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  c.status(200);
  return c.json({ response: response.id });
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const response = await prisma.blog.findMany({
      select: {
        id: true,
        content: true,
        title: true,
        createdAt: true,
        publishedDate: true,
        author: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            likes: true,
            dislikes: true,
          },
        },
      },
    });
    c.status(200);
    return c.json({ response });
  } catch (e) {
    console.error("Error fetching blog posts: ", e);
    c.status(500);
    return c.json({ message: "Error while fetching blog posts" });
  }
});

blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = c.req.param("id");
  const userId = c.get("userId");
  try {
    const response = await prisma.blog.findFirst({
      where: { id: id },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
        likes: {
          select: {
            id: true,
          },
        },
        dislikes: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!response) {
      c.status(404);
      return c.json({ message: "Blog not found" });
    }
    const isLiked = response.likes.some((user) => user.id === userId);
    const isDisliked = response.dislikes.some((user) => user.id === userId);
    c.status(200);
    return c.json({
      response,
      isLiked,
      isDisliked,
      likeCount: response.likes.length,
      dislikeCount: response.dislikes.length,
    });
  } catch (e) {
    console.error("Error fetching blog:", e);
    c.status(500);
    return c.json({ message: "Error fetching blog" });
  }
});



blogRouter.put('/like/:id', async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  const blogId = c.req.param('id');
  const userId = c.get("userId");

  try {
      const blog = await prisma.blog.findUnique({
          where: { id: blogId },
          include: { likes: true, dislikes: true }
      });

      if (!blog) {
          c.status(404);
          return c.json({ message: "Blog not found" });
      }

      // Remove from dislikes if present
      await prisma.blog.update({
          where: { id: blogId },
          data: { dislikes: { disconnect: { id: userId } } }
      });

      // Toggle like status
      const isLiked = blog.likes.some(user => user.id === userId);
      if (isLiked) {
          await prisma.blog.update({
              where: { id: blogId },
              data: { likes: { disconnect: { id: userId } } }
          });
          return c.json({ message: "Like removed" });
      } else {
          await prisma.blog.update({
              where: { id: blogId },
              data: { likes: { connect: { id: userId } } }
          });
          return c.json({ message: "Blog liked" });
      }

  } catch (e) {
      console.error("Error liking blog:", e);
      c.status(500);
      return c.json({ message: "Error liking blog" });
  }
});


blogRouter.put('/dislike/:id', async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  const blogId = c.req.param('id');
  const userId = c.get("userId");

  try {
      const blog = await prisma.blog.findUnique({
          where: { id: blogId },
          include: { likes: true, dislikes: true }
      });

      if (!blog) {
          c.status(404);
          return c.json({ message: "Blog not found" });
      }

      // Remove from likes if present
      await prisma.blog.update({
          where: { id: blogId },
          data: { likes: { disconnect: { id: userId } } }
      });

      // Toggle dislike status
      const isDisliked = blog.dislikes.some(user => user.id === userId);
      if (isDisliked) {
          await prisma.blog.update({
              where: { id: blogId },
              data: { dislikes: { disconnect: { id: userId } } }
          });
          return c.json({ message: "Dislike removed" });
      } else {
          await prisma.blog.update({
              where: { id: blogId },
              data: { dislikes: { connect: { id: userId } } }
          });
          return c.json({ message: "Blog disliked" });
      }

  } catch (e) {
      console.error("Error disliking blog:", e);
      c.status(500);
      return c.json({ message: "Error disliking blog" });
  }
});