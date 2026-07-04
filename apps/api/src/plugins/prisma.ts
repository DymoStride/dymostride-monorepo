import fp from "fastify-plugin";
import { prisma } from "../lib/prisma.js";
import type { PrismaClient } from "../generated/prisma/client.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(async (fastify) => {
  await prisma.$connect();
  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (instance) => {
    await instance.prisma.$disconnect();
  });
});
