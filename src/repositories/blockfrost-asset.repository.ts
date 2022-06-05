import BlockfrostAsset = require("../models/blockfrost-asset");
import {BlockfrostAssetType} from "../types/blockfrost-asset.type";

const getByAsset = async (asset: string): Promise<BlockfrostAssetType> => {
  return await BlockfrostAsset.findOne({asset: asset});
};

const getAllByPolicyId = async (policyId: string): Promise<BlockfrostAssetType[]> => {
  return await BlockfrostAsset.find({policy_id: policyId});
};

const addAll = async (blockfrostAssets: BlockfrostAssetType[]) => {
  return await BlockfrostAsset.collection.insertMany(blockfrostAssets);
};

const deleteAllByPolicyId = async (policyId: string) => {
  return await BlockfrostAsset.deleteMany({policy_id: policyId});
};

export {getByAsset, getAllByPolicyId, addAll, deleteAllByPolicyId};
