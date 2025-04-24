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
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const existingUser = await prisma.user.findUnique({ where: { email: body.email } });
    if (existingUser) {
      c.status(409);
      return c.json({ message: "Username already exists" });
    }
    const response = await prisma.user.create({
      data: {
        name: body.name,
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
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ message: "Sign-up failed, please try again" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  //Validate Request Body
  const { success, error } = SignInInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ message: "Invalid Credentials" });
  }
  //Check if user Exists
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) {
    c.status(401);
    return c.json({ message: "User Not found" });
  }
  //verify Password
  const ValidPass = await prisma.user.findUnique({ where: { email: body.email, password: body.password } });
  if (!user) {
    c.status(401);
    return c.json({ message: "Invalid password" });
  }
  const payload = {
    id: user.id,
    role: "user",
  };
  //Generate JWT Token for the user
  const token: string = await sign(payload, c.env.JWT_secret);

  return c.json({ token: token });
});
