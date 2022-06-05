import * as Router from "koa-router";
import {getAssetsFromPolicyId, getAssetInfo} from "../services/blockfrost.service";

const router = new Router({
  prefix: "/blockfrost"
});

router.get("/", async ctx => {
  const policyId = <string>ctx.request.query["policy-id"];
  const projectId = <string>ctx.request.query["project-id"];
  let page = ctx.request.query["page"];

  if (policyId == null || projectId == null) {
    ctx.response.status = 400;
    ctx.body = "policy-id required";
    return;
  }

  if (page == null) page = "1";

  const result = await getAssetsFromPolicyId(policyId, projectId, +page);

  ctx.response.status = 200;
  ctx.body = result;
});

router.get("/asset", async ctx => {
  const policyId = <string>ctx.request.query["asset-id"];
  const projectId = <string>ctx.request.query["project-id"];

  if (policyId == null || projectId == null) {
    ctx.response.status = 400;
    ctx.body = "policy-id required";
    return;
  }

  const result = await getAssetInfo(policyId, projectId);

  ctx.response.status = 200;
  ctx.body = result;
});

export = router;
