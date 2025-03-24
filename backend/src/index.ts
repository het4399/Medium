import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
const app = new Hono();

app.post("/api/v1/user/signup", (c) => {
  return c.text("Hello from Singup!");
});

app.post("/api/v1/user/signin", (c) => {
  return c.text("Hello from Signin!");
});

app.post("/api/v1/blog", (c) => {
  return c.text("Hello from blog!");
});

app.put("/api/v1/blog", (c) => {
  return c.text("Hello from blog delete route!");
});

app.get("/api/v1/blog/:id", (c) => {
  const id=c.req.param('id');
  console.log(id);
  return c.text("Hello from blog id!");
});

app.get("/api/v1/blog/bulk", (c) => {
  return c.text("Hello from blog bulk route!");
});

export default app;
