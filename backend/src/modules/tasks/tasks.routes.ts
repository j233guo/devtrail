import type { FastifyInstance, FastifyReply } from "fastify";

import { getProjectById } from "../projects/projects.repo.js";
import { createApiResponse } from "../../shared/utils/api-response.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasksByProjectId,
  updateTask,
} from "./tasks.repo.js";
import type { IDeleteTaskResult, ITask, ITaskPayload } from "./tasks.models.js";

// Represents route parameters for project task collection endpoints.
interface IProjectTaskParams {
  project_id: string;
}

// Represents route parameters for task id endpoints.
interface ITaskParams {
  task_id: string;
}

// Parses route ids into positive integer ids.
function parsePositiveId(id: string): number | null {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    return null;
  }

  return parsedId;
}

// Sends a consistent invalid project id response.
function sendInvalidProjectId(reply: FastifyReply): FastifyReply {
  return reply
    .code(400)
    .send(createApiResponse<null>("BAD_REQUEST", "Invalid project id.", null));
}

// Sends a consistent invalid task id response.
function sendInvalidTaskId(reply: FastifyReply): FastifyReply {
  return reply.code(400).send(createApiResponse<null>("BAD_REQUEST", "Invalid task id.", null));
}

// Sends a consistent project not found response.
function sendProjectNotFound(reply: FastifyReply): FastifyReply {
  return reply.code(404).send(createApiResponse<null>("NOT_FOUND", "Project not found.", null));
}

// Sends a consistent task not found response.
function sendTaskNotFound(reply: FastifyReply): FastifyReply {
  return reply.code(404).send(createApiResponse<null>("NOT_FOUND", "Task not found.", null));
}

// Checks whether an unknown request body is a valid task payload.
function isTaskPayload(payload: unknown): payload is ITaskPayload {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }

  const candidate = payload as Partial<ITaskPayload>;

  return (
    typeof candidate.title === "string" &&
    candidate.title.trim().length > 0 &&
    typeof candidate.description === "string" &&
    typeof candidate.status === "string" &&
    candidate.status.trim().length > 0 &&
    typeof candidate.priority === "string" &&
    candidate.priority.trim().length > 0 &&
    typeof candidate.acceptance_criteria === "string"
  );
}

// Sends a consistent invalid task payload response.
function sendInvalidPayload(reply: FastifyReply): FastifyReply {
  return reply
    .code(400)
    .send(createApiResponse<null>("BAD_REQUEST", "Invalid task payload.", null));
}

// Registers task CRUD API routes.
export async function tasksRoutes(app: FastifyInstance) {
  app.get<{ Params: IProjectTaskParams }>(
    "/api/projects/:project_id/tasks",
    async (request, reply) => {
      const projectId = parsePositiveId(request.params.project_id);

      if (!projectId) {
        return sendInvalidProjectId(reply);
      }

      if (!getProjectById(projectId)) {
        return sendProjectNotFound(reply);
      }

      return createApiResponse<ITask[]>("OK", "Tasks loaded.", listTasksByProjectId(projectId));
    },
  );

  app.post<{ Params: IProjectTaskParams; Body: unknown }>(
    "/api/projects/:project_id/tasks",
    async (request, reply) => {
      const projectId = parsePositiveId(request.params.project_id);

      if (!projectId) {
        return sendInvalidProjectId(reply);
      }

      if (!isTaskPayload(request.body)) {
        return sendInvalidPayload(reply);
      }

      if (!getProjectById(projectId)) {
        return sendProjectNotFound(reply);
      }

      const task = createTask(projectId, request.body);

      return reply.code(201).send(createApiResponse<ITask>("CREATED", "Task created.", task));
    },
  );

  app.get<{ Params: ITaskParams }>("/api/tasks/:task_id", async (request, reply) => {
    const taskId = parsePositiveId(request.params.task_id);

    if (!taskId) {
      return sendInvalidTaskId(reply);
    }

    const task = getTaskById(taskId);

    if (!task) {
      return sendTaskNotFound(reply);
    }

    return createApiResponse<ITask>("OK", "Task loaded.", task);
  });

  app.put<{ Params: ITaskParams; Body: unknown }>("/api/tasks/:task_id", async (request, reply) => {
    const taskId = parsePositiveId(request.params.task_id);

    if (!taskId) {
      return sendInvalidTaskId(reply);
    }

    if (!isTaskPayload(request.body)) {
      return sendInvalidPayload(reply);
    }

    const task = updateTask(taskId, request.body);

    if (!task) {
      return sendTaskNotFound(reply);
    }

    return createApiResponse<ITask>("OK", "Task updated.", task);
  });

  app.delete<{ Params: ITaskParams }>("/api/tasks/:task_id", async (request, reply) => {
    const taskId = parsePositiveId(request.params.task_id);

    if (!taskId) {
      return sendInvalidTaskId(reply);
    }

    const wasDeleted = deleteTask(taskId);

    if (!wasDeleted) {
      return sendTaskNotFound(reply);
    }

    return createApiResponse<IDeleteTaskResult>("OK", "Task deleted.", {
      deleted: true,
    });
  });
}
