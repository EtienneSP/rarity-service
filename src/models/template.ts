import * as Mongoose from "mongoose";

const templateSchema = new Mongoose.Schema({
  policyId: {
    type: String,
    required: true
  },
  attributeKeyAndPath: {
    type: Map,
    of: String,
    required: true
  }
});

export = Mongoose.model("Template", templateSchema);
