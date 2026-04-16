import { handle } from "hono/vercel";
import app from "../src/worker/index";

export const config = {
  runtime: "edge",
};

export default handle(app);
