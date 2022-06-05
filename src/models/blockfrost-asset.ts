import * as Mongoose from "mongoose";

const blockfrostAssetSchema = new Mongoose.Schema({
  asset: String,
  policy_id: String,
  asset_name: String,
  fingerprint: String,
  quantity: String,
  initial_mint_tx_hash: String,
  mint_or_burn_count: Number,
  onchain_metadata: Object,
  metadata: Object
});

export = Mongoose.model("BlockfrostAsset", blockfrostAssetSchema);
