import { Hono } from "hono";
import { verify } from "hono/jwt";
export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_secret: string;
  };
}>();
blogRouter.use("/api/v1/blog/*", async (c, next) => {
  const authorization = c.req.header("authorization");
  if (!authorization) {
    c.status(401);
    return c.json({ message: "Missing authorization header" });
  }
  const token = authorization.split(" ")[1];

  const user = await verify(token, c.env.JWT_secret);
  if (user.id) {
    next();
  } else {
    c.status(403);
    return c.json({ message: "Invalid token" });
  }
});

blogRouter.post("/api/v1/blog", (c) => {
  return c.text("Hello from blog!");
});

blogRouter.put("/api/v1/blog", (c) => {
  return c.text("Hello from blog delete route!");
});

blogRouter.get("/api/v1/blog/:id", (c) => {
  const id = c.req.param("id");
  console.log(id);
  return c.text("Hello from blog id!");
});

blogRouter.get("/api/v1/blog/bulk", (c) => {
  return c.text("Hello from blog bulk route!");
});
