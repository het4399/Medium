import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
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
  if (!ValidPass) {
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

//LogOut
userRouter.post("/logout", async (c) => {
  const authHeader = c.req.header("Authorization");

  // Check if Authorization header exists
  if (authHeader) {
    return c.json({ message: "Logged out successfully" });
  } else {
    c.status(403);
    return c.json({ message: "JWT authentication failed" });
  }
});

//TO get user details
userRouter.get("/profile", async (c) => {
  const authHeader = c.req.header("authorization") || "";
  try {
    // Verify the JWT token from the Authorization header
    const userData = (await verify(authHeader, c.env.JWT_secret)) as { id: string };
    if (!userData) {
      c.status(403);
      return c.json({ message: "Unauthorized" });
    }

    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

    // Query the database for the user by id
    const user = await prisma.user.findUnique({ where: { id: userData.id } });
    if (!user) {
      c.status(404);
      return c.json({ message: "User not found" });
    }

    // Return the user's details (modify as needed if you store an email)
    return c.json({ user: { name: user.name, email: user.email } });
  } catch (e) {
    c.status(403);
    return c.json({ message: "Authorization failed" });
  }
});

// Update user
userRouter.put("/setting", async (c) => {
  const authHeader = c.req.header("authorization") || "";
  try {
    const userData = (await verify(authHeader, c.env.JWT_secret)) as { id: string };
    if (!userData) {
      c.status(403);
      return c.json({ message: "Unauthorized" });
    }

    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
    const body = await c.req.json();

    // Validate required fields
    const { success } = SignUpInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({ message: "Invalid credentials" });
    }

    // Check if the username already exists (for a different user)
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existingUser && existingUser.id !== userData.id) {
      c.status(400);
      return c.json({ message: "Username already exists" });
    }

    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;
    if (body.password) updateData.password = body.password;

    const updatedUser = await prisma.user.update({
      where: { id: userData.id },
      data: updateData,
    });

    return c.json({
      message: "Settings updated successfully",
      user: { name: updatedUser.name, email: updatedUser.email },
    });
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ message: "Failed to update settings" });
  }
});
