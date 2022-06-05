import * as Mongoose from "mongoose";

const projectSchema = new Mongoose.Schema({
  policyId: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  properties: {
    type: Object,
    required: true
  }
});

export = Mongoose.model("Project", projectSchema);
