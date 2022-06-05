import templateRepository = require("../repositories/template.repository");

const getById = async (id: string) => {
  return await templateRepository.getById(id);
};

const getByPolicyId = async (policyId: string) => {
  return await templateRepository.getByPolicyId(policyId);
};

const add = async (template: {policyId: string; attributeKeyAndPath: string}) => {
  return await templateRepository.add(template);
};

const deleteByPolicyId = async (policyId: string) => {
  return await templateRepository.deleteByPolicyId(policyId);
};

export {getById, getByPolicyId, add, deleteByPolicyId};
