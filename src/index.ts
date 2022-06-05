import Koa = require("koa");
import bodyParser = require("koa-bodyparser");
import initDB = require("./database");

import projectController = require("./controllers/project.controller");
import templateController = require("./controllers/template.controller");
import assetController = require("./controllers/asset.controller");
import blockfrostController = require("./controllers/blockfrost.controller");
import rarityController = require("./controllers/rarity.controller");

initDB();

const app = new Koa();

app.use(bodyParser());

app
  .use(projectController.routes())
  .use(projectController.allowedMethods())
  .use(templateController.routes())
  .use(templateController.allowedMethods())
  .use(assetController.routes())
  .use(assetController.allowedMethods())
  .use(blockfrostController.routes())
  .use(blockfrostController.allowedMethods())
  .use(rarityController.routes())
  .use(rarityController.allowedMethods());

app.listen(5001);
console.log("Application is running on port 5001");
