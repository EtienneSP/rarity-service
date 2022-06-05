import assetRepository = require("../repositories/asset.repository");

const getById = async (id: string) => {
  return await assetRepository.getById(id);
};

const getByFingerprint = async (fingerPrint: string) => {
  return await assetRepository.getByFingerprint(fingerPrint);
};

const getAllByPolicyId = async (policyId: string) => {
  return await assetRepository.getAllByPolicyId(policyId);
};

const deleteAllByPolicyId = async (policyId: string) => {
  return await assetRepository.deleteAllByPolicyId(policyId);
};

export {getById, getByFingerprint, getAllByPolicyId, deleteAllByPolicyId};
