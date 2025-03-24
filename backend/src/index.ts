import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";

const app = new Hono();
app.use("/api/v1/blog/*", async (c, next) => {
  const authorization = c.req.header("authorization");
  if (!authorization) {
    c.status(401);
    return c.json({ message: "Missing authorization header" });
  }
  const token = authorization.split(" ")[1];
  //@ts-ignore
  const user = await verify(token, c.env.JWT_secret);
  if (user.id) {
    next();
  } else {
    c.status(403);
    return c.json({ message: "Invalid token" });
  }
});
app.post("/api/v1/user/signup", async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const response = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    },
  });
  const payload = {
    id: response.id,
    role: "user",
  };
  // const jwtSecret = process.env.JWT_secret;
  // if (!jwtSecret) {
  //   throw new Error("JWT secret is not defined");
  // }
  //@ts-ignore
  const token: String = await sign(payload, c.env.JWT_secret);
  return c.json({ token: token });
});

app.post("/api/v1/user/signin", async (c) => {
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const user = await prisma.user.findUnique({ where: { email: body.email, password: body.password } });
  if (!user) {
    c.status(401);
    return c.json({ message: "Invalid credentials" });
  }
  const payload = {
    id: user.id,
    role: "user",
  }; //@ts-ignore
  const token: string = await sign(payload, c.env.JWT_secret);

  return c.json({ token: token });
});

app.post("/api/v1/blog", (c) => {
  return c.text("Hello from blog!");
});

app.put("/api/v1/blog", (c) => {
  return c.text("Hello from blog delete route!");
});

app.get("/api/v1/blog/:id", (c) => {
  const id = c.req.param("id");
  console.log(id);
  return c.text("Hello from blog id!");
});

app.get("/api/v1/blog/bulk", (c) => {
  return c.text("Hello from blog bulk route!");
});

export default app;
