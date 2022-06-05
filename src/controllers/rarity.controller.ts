import * as Router from "koa-router";
import {generatePolicyRarity, deletePolicyIdData} from "../services/rarity.service";

const router = new Router({
  prefix: "/rarity"
});

router.get("/", async ctx => {
  const policyId = <string>ctx.request.query["policy-id"];
  const projectName = <string>ctx.request.query["project-name"];
  const projectId = <string>ctx.request.query["project-id"];
  const pageLimit = ctx.request.query["page-limit"];

  if (policyId == null || projectId == null || projectName == null) {
    ctx.response.status = 400;
    ctx.body = "missing required property (policy-id, project-id, project-name)";
    return;
  }

  const result = await generatePolicyRarity(policyId, projectName, projectId, +pageLimit);

  ctx.response.status = 200;
  ctx.body = result;
});

router.delete("/:policyId", async ctx => {
  const policyId = ctx.params.policyId;

  if (policyId == null) {
    ctx.response.status = 400;
    ctx.body = "PolicyId cannot be null";
    return;
  }

  const result = await deletePolicyIdData(policyId);

  ctx.response.status = 200;
  ctx.body = result;
});

export = router;
