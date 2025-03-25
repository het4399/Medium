import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { SignUpInput, SignInInput } from "@het4399/common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_secret: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const { success, error } = SignUpInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ message: error.toString() });
  }
  const prisma = new PrismaClient({
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

  const token: String = await sign(payload, c.env.JWT_secret);
  return c.json({ token: token });
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success, error } = SignInInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ message: error.toString() });
  }
  const user = await prisma.user.findUnique({ where: { email: body.email, password: body.password } });
  if (!user) {
    c.status(401);
    return c.json({ message: "Invalid credentials" });
  }
  const payload = {
    id: user.id,
    role: "user",
  };
  const token: string = await sign(payload, c.env.JWT_secret);

  return c.json({ token: token });
});
