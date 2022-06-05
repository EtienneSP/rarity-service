import projectRepository = require("../repositories/project.repository");

const getById = async (id: string) => {
  return await projectRepository.getById(id);
};

const getAll = async () => {
  return await projectRepository.getAll();
};

const add = async (project: {policyId: string; projectName: string; size: number; properties: object}) => {
  return await projectRepository.add(project);
};

const update = async (
  id: string,
  project: {policyId: string; projectName: string; size: number; properties: object}
) => {
  return await projectRepository.update(id, project);
};

const deleteByPolicyId = async (policyId: string) => {
  return await projectRepository.deleteByPolicyId(policyId);
};

export {getById, getAll, add, update, deleteByPolicyId};
