import { randomUUID } from "node:crypto";
import { Database } from "../database/index.js";
import { buildRoutePath } from "../utils/buildRoutePath.js";

const connectionDB = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/task"),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null,
      };

      connectionDB.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = connectionDB.select("tasks");

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/task/taskfilter"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = connectionDB.select("tasks", {
        title: search,
        id: search,
      });
      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/task/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      connectionDB.update("tasks", id, {
        completed_at: new Date(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/task/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const task = {
        title,
        description,
        updated_at: new Date(),
      };

      connectionDB.update("tasks", id, task);

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/task/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      connectionDB.delete("tasks", id);

      return res.writeHead(201).end();
    },
  },
];
