import type { PrismaClient } from "../../generated/prisma/client.js";
import type { CreateUserRequest } from "@repo/shared";

export class UserService {
  constructor(private prisma: PrismaClient) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  create(data: CreateUserRequest) {
    return this.prisma.user.create({ data });
  }
}
