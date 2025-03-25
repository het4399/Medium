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
  const token = authorization.split(" ")[1];

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
  const response = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: userId,
    },
  });
  c.status(200);
  return c.json({ response: response.id });
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

blogRouter.get("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  const response = await prisma.blog.findMany({
    where: { id: body.id },
  });
  c.status(200);
  return c.json({ response });
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const response = await prisma.blog.findMany();
  c.status(200);
  return c.json({ response });
});
