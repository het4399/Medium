import { Hono } from "hono";
import { decode, sign, verify } from "hono/jwt";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    NODE_ENV: string;
    DATABASE_URL: string;
    JWT_secret: string;
    PROD_CORS_ORIGIN: string;
  };
}>();
app.use("/*", async (c, next) => {
  const isDevelopment = c.env.NODE_ENV === "development";
  const corsOptions = {
    origin: isDevelopment ? "*" : c.env.PROD_CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin"], 
    credentials: true,
  };
  return await cors(corsOptions)(c, next);
});

app.get("/", (c) => {
  return c.json({ message: "CORS is working!" });
});
app.route("/api/v1/users", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;
