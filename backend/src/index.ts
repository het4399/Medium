import { Hono } from "hono";
import { decode, sign, verify } from "hono/jwt";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_secret: string;
  };
}>();

app.route("/api/v1/users", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;
