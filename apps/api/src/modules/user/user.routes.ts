import type { FastifyInstance } from "fastify";
import { createUser, listUsers } from "./user.controller.js";

export async function userRoutes(app: FastifyInstance) {
  app.get("/", listUsers);

  app.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", format: "email" },
            name: { type: "string" },
          },
        },
      },
    },
    createUser,
  );
}
