import type { FastifyInstance, FastifyReply } from "fastify";

import { createApiResponse } from "../../shared/utils/api-response.js";
import {
  createProject,
  deleteProject,
  getProjectById,
  listProjects,
  updateProject,
} from "./projects.repo.js";
import type { IProject, IProjectDeleteResponse, IProjectPayload } from "./projects.models.js";

// Represents route parameters for project id endpoints.
interface IProjectParams {
  id: string;
}

// Parses route ids into positive integer project ids.
function parseProjectId(id: string): number | null {
  const projectId = Number(id);

  if (!Number.isInteger(projectId) || projectId < 1) {
    return null;
  }

  return projectId;
}

// Sends a consistent bad id response.
function sendInvalidId(reply: FastifyReply): FastifyReply {
  return reply
    .code(400)
    .send(createApiResponse<null>("BAD_REQUEST", "Invalid project id.", null));
}

// Sends a consistent project not found response.
function sendNotFound(reply: FastifyReply): FastifyReply {
  return reply.code(404).send(createApiResponse<null>("NOT_FOUND", "Project not found.", null));
}

// Checks whether an unknown request body is a valid project payload.
function isProjectPayload(payload: unknown): payload is IProjectPayload {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }

  const candidate = payload as Partial<IProjectPayload>;

  return (
    typeof candidate.name === "string" &&
    candidate.name.trim().length > 0 &&
    typeof candidate.description === "string" &&
    Array.isArray(candidate.tech_stack) &&
    candidate.tech_stack.every((item) => typeof item === "string") &&
    typeof candidate.status === "string" &&
    candidate.status.trim().length > 0
  );
}

// Sends a consistent invalid payload response.
function sendInvalidPayload(reply: FastifyReply): FastifyReply {
  return reply
    .code(400)
    .send(createApiResponse<null>("BAD_REQUEST", "Invalid project payload.", null));
}

// Registers project CRUD API routes.
export async function projectsRoutes(app: FastifyInstance) {
  app.get("/api/projects", async () =>
    createApiResponse<IProject[]>("OK", "Projects loaded.", listProjects()),
  );

  app.get<{ Params: IProjectParams }>("/api/projects/:id", async (request, reply) => {
    const projectId = parseProjectId(request.params.id);

    if (!projectId) {
      return sendInvalidId(reply);
    }

    const project = getProjectById(projectId);

    if (!project) {
      return sendNotFound(reply);
    }

    return createApiResponse<IProject>("OK", "Project loaded.", project);
  });

  app.post<{ Body: unknown }>("/api/projects", async (request, reply) => {
    if (!isProjectPayload(request.body)) {
      return sendInvalidPayload(reply);
    }

    const project = createProject(request.body);

    return reply
      .code(201)
      .send(createApiResponse<IProject>("CREATED", "Project created.", project));
  });

  app.put<{ Params: IProjectParams; Body: unknown }>("/api/projects/:id", async (request, reply) => {
    const projectId = parseProjectId(request.params.id);

    if (!projectId) {
      return sendInvalidId(reply);
    }

    if (!isProjectPayload(request.body)) {
      return sendInvalidPayload(reply);
    }

    const project = updateProject(projectId, request.body);

    if (!project) {
      return sendNotFound(reply);
    }

    return createApiResponse<IProject>("OK", "Project updated.", project);
  });

  app.delete<{ Params: IProjectParams }>("/api/projects/:id", async (request, reply) => {
    const projectId = parseProjectId(request.params.id);

    if (!projectId) {
      return sendInvalidId(reply);
    }

    const wasDeleted = deleteProject(projectId);

    if (!wasDeleted) {
      return sendNotFound(reply);
    }

    return createApiResponse<IProjectDeleteResponse>("OK", "Project deleted.", {
      deleted: true,
    });
  });
}
