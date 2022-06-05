import * as Router from "koa-router";
import {getById, getAll, add, update, deleteByPolicyId} from "../services/project.service";

const router = new Router({
  prefix: "/projects"
});

router.get("/:id", async ctx => {
  const id = ctx.params.id;
  const project = await getById(id);

  if (project == null) ctx.response.status = 404;
  else ctx.body = project;
});

router.get("/", async ctx => {
  ctx.body = await getAll();
});

router.post("/", async ctx => {
  let project = ctx.request.body;
  project = await add(project);

  ctx.response.status = 200;
  ctx.body = project;
});

router.put("/:id", async ctx => {
  const id = ctx.params.id;
  const project = ctx.request.body;

  const result = await update(id, project);

  ctx.response.status = 200;
  ctx.body = result;
});

router.delete("/:id", async ctx => {
  const policyId = ctx.params.policyId;
  const result = await deleteByPolicyId(policyId);

  ctx.response.status = 200;
  ctx.body = result;
});

export = router;
