import { Hono } from "hono";
import { verify } from "hono/jwt";
export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_secret: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
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

blogRouter.post("/", (c) => {
  return c.text("Hello from blog!");
});

blogRouter.put("/", (c) => {
  return c.text("Hello from blog delete route!");
});

blogRouter.get("/:id", (c) => {
  const id = c.req.param("id");
  console.log(id);
  return c.text("Hello from blog id!");
});

blogRouter.get("/bulk", (c) => {
  return c.text("Hello from blog bulk route!");
});
