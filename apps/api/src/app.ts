import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma.js";
import { userRoutes } from "./modules/user/user.routes.js";

export function buildApp() {
  const app = Fastify({ logger: true });
  app.register(prismaPlugin);
  app.register(userRoutes, { prefix: "/api/users" });
  return app;
}
