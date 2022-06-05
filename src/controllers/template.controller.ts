import * as Router from "koa-router";
import {getById, getByPolicyId, add, deleteByPolicyId} from "../services/template.service";

const router = new Router({
  prefix: "/templates"
});

router.get("/:id", async ctx => {
  const id = ctx.params.id;
  ctx.body = await getById(id);
});

router.get("/policy-id/:policyId", async ctx => {
  const policyId = ctx.params.policyId;
  ctx.body = await getByPolicyId(policyId);
});

router.post("/", async ctx => {
  const template = ctx.request.body;
  const result = await add(template);

  ctx.response.status = 200;
  ctx.body = result;
});

router.delete("/policy-id/:policyId", async ctx => {
  const id = ctx.params.policyId;
  const result = await deleteByPolicyId(id);

  ctx.response.status = 200;
  ctx.body = result.deletedCount;
});

export = router;
