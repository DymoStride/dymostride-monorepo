import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateUserRequest } from "@repo/shared";
import { UserService } from "./user.service.js";

export async function createUser(req: FastifyRequest, reply: FastifyReply) {
  const service = new UserService(req.server.prisma);
  const user = await service.create(req.body as CreateUserRequest);
  return reply.code(201).send(user);
}

export async function listUsers(req: FastifyRequest, reply: FastifyReply) {
  const service = new UserService(req.server.prisma);
  return reply.send(await service.findAll());
}
