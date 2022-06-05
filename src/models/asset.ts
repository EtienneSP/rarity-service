import * as Mongoose from "mongoose";

const assetSchema = new Mongoose.Schema({
  blockfrostId: {
    type: String,
    required: true
  },
  policyId: {
    type: String,
    required: true
  },
  fingerprint: {
    type: String,
    required: true
  },
  assetName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  metadata: {
    type: Object,
    required: false
  },
  rarity: {
    type: Object,
    required: false
  }
});

export = Mongoose.model("Asset", assetSchema);
