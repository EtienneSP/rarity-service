import Project = require("../models/project");

const getById = async (id: string) => {
  return await Project.findById({_id: id});
};

const getByPolicyId = async (policyId: string) => {
  return await Project.findOne({policyId: policyId});
};

const getAll = async () => {
  return await Project.find();
};

const add = async (project: object) => {
  const newProject = new Project(project);
  newProject.save();
  return project;
};

const update = async (id: string, project: object) => {
  return await Project.replaceOne({_id: id}, project);
};

const deleteByPolicyId = async (policyId: string) => {
  return await Project.deleteOne({policyId: policyId});
};

export {getById, getByPolicyId, getAll, add, update, deleteByPolicyId};
