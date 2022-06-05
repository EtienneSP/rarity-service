import * as Router from "koa-router";
import {getById, getByFingerprint, getAllByPolicyId, deleteAllByPolicyId} from "../services/asset.service";

const router = new Router({
  prefix: "/assets"
});

router.get("/:id", async ctx => {
  const id = ctx.params.id;
  const asset = await getById(id);

  if (asset == null) ctx.response.status = 404;
  else ctx.body = asset;
});

router.get("/fingerprint/:fingerprint", async ctx => {
  const fingerprint = ctx.params.fingerprint;
  const asset = await getByFingerprint(fingerprint);

  if (asset == null) ctx.response.status = 404;
  else ctx.body = asset;
});

router.get("/policy-id/:policyId", async ctx => {
  const policyId = ctx.params.policyId;
  const asset = await getAllByPolicyId(policyId);

  if (asset == null) ctx.response.status = 404;
  else ctx.body = asset;
});

router.delete("/policy-id/:policyId", async ctx => {
  const policyId = ctx.params.policyId;
  const result = await deleteAllByPolicyId(policyId);

  ctx.response.status = 200;
  ctx.body = result;
});

export = router;
