import Asset = require("../models/asset");
import {AssetType} from "../types/asset.type";

const getById = async (id: string) => {
  return await Asset.findById(id);
};

const getByFingerprint = async (fingerprint: string) => {
  return await Asset.findOne({fingerprint: fingerprint});
};

const getAllByPolicyId = async (policyId: string) => {
  return await Asset.find({policyId: policyId});
};

const add = async (asset: AssetType) => {
  const newAsset = new Asset(asset);
  newAsset.save();
  return asset;
};

const update = async (id: string, asset: object) => {
  return await Asset.replaceOne({_id: id}, asset);
};

const upsert = async (asset: AssetType) => {
  return await Asset.findOneAndUpdate({fingerprint: asset.fingerprint}, asset, {
    upsert: true,
    new: true,
    runValidators: true
  });
};

const deleteById = async (id: string) => {
  return await Asset.deleteOne({_id: id});
};

const deleteAllByPolicyId = async (policyId: string) => {
  return await Asset.deleteMany({policyId: policyId});
};

export {getById, getByFingerprint, getAllByPolicyId, add, update, upsert, deleteById, deleteAllByPolicyId};
