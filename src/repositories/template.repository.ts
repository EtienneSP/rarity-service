import Template = require("../models/template");

const getById = async (id: string) => {
  return await Template.findById({_id: id});
};

const getByPolicyId = async (policyId: string) => {
  return await Template.findOne({policyId: policyId});
};

const add = async (template: object) => {
  const newTemplate = new Template(template);
  newTemplate.save();
  return template;
};

const deleteByPolicyId = async (policyId: string) => {
  return await Template.deleteOne({policyId: policyId});
};

export {getById, getByPolicyId, add, deleteByPolicyId};
