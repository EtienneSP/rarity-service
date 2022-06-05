import {getAssetsFromPolicyId, getAssetInfo} from "../services/blockfrost.service";

import projectRepository = require("../repositories/project.repository");
import assetRepository = require("../repositories/asset.repository");
import templateRepository = require("../repositories/template.repository");

import blockfrostAssetRepository = require("../repositories/blockfrost-asset.repository");

import {BlockfrostAssetType} from "../types/blockfrost-asset.type";
import {AssetType} from "../types/asset.type";
import {AssetRarity} from "../types/asset-rarity.type";

const generatePolicyRarity = async (policyId: string, projectName: string, projectId: string, pageLimit: number) => {
  const template = await templateRepository.getByPolicyId(policyId);
  if (template == null) throw `No template are defined for this policyId ${policyId}.`;

  let assetData: BlockfrostAssetType[] = [];
  let blockfrostAsset: {asset: string; quantity: number}[] = [];

  if (pageLimit == null) pageLimit = 105;

  for (let page = 1; page <= pageLimit; page++) {
    const newAssets = await getAssetsFromPolicyId(policyId, projectId, page);
    if (newAssets.length === 0) break;

    blockfrostAsset = blockfrostAsset.concat(newAssets);
  }

  const knownBlockfrostAsset = await blockfrostAssetRepository.getAllByPolicyId(policyId);
  const newBlockFrostAsset = blockfrostAsset.filter(x => !knownBlockfrostAsset.some(y => x.asset == y.asset));

  if (newBlockFrostAsset.length > 0) {
    for await (const asset of newBlockFrostAsset) {
      if (asset.quantity == 0) continue;

      const data = await getAssetInfo(asset.asset, projectId);
      assetData.push(data);
    }

    if (assetData.length > 0) blockfrostAssetRepository.addAll(assetData);
  }

  assetData = assetData.concat(knownBlockfrostAsset);
  const existingProject = await projectRepository.getByPolicyId(policyId);

  if (existingProject != null && assetData.length == existingProject.size)
    return {"Existing data is complete": existingProject.properties};

  const rarityMap = generatePolicyRarityFromTemplate(assetData, template.attributeKeyAndPath.toJSON());
  const assets = await generateAssetRarityAndScore(assetData, rarityMap, template.attributeKeyAndPath.toJSON());

  await persistRarityData(assets, policyId, projectName, assetData.length, rarityMap);

  return {"Rarity map updated": rarityMap};
};

const deletePolicyIdData = async (policyId: string) => {
  await assetRepository.deleteAllByPolicyId(policyId);
  await blockfrostAssetRepository.deleteAllByPolicyId(policyId);
  await projectRepository.deleteByPolicyId(policyId);
};

const generatePolicyRarityFromTemplate = (
  assetData: BlockfrostAssetType[],
  attributeKeyAndPath: {[key: string]: string}
): {[key: string]: {[key: string]: number}} => {
  const rarityMap: {[key: string]: {[key: string]: number}} = {};

  for (const [key] of Object.entries(attributeKeyAndPath)) {
    rarityMap[key] = {};
  }

  for (const data of assetData) {
    const metadata = data.onchain_metadata;

    for (const [key, path] of Object.entries(attributeKeyAndPath)) {
      const value = extractKeyValue(metadata, path);

      if (value) {
        if (Object.prototype.hasOwnProperty.call(rarityMap[key], value)) rarityMap[key][value] += 1;
        else rarityMap[key][value] = 1;
      } else {
        if (Object.prototype.hasOwnProperty.call(rarityMap[key], "None")) rarityMap[key]["None"] += 1;
        else rarityMap[key]["None"] = 1;
      }
    }
  }

  return rarityMap;
};

const generateAssetRarityAndScore = async (
  blockfrostAssets: BlockfrostAssetType[],
  rarityMap: object,
  attributeKeyAndPath: {[key: string]: string}
): Promise<AssetType[]> => {
  const assetRarity: {asset: BlockfrostAssetType; rarity: AssetRarity}[] = [];
  const assets: AssetType[] = [];
  const assetCount = blockfrostAssets.length;

  for (const asset of blockfrostAssets) {
    const rarity = generateAssetRarity(asset, rarityMap, assetCount, attributeKeyAndPath);
    assetRarity.push({asset, rarity});
  }

  assetRarity.sort((a, b) => (a.rarity.score > b.rarity.score ? 1 : -1));
  let rank = 1;

  for (const {asset, rarity} of assetRarity) {
    rarity["rank"] = rank;
    rank++;

    assets.push({
      blockfrostId: asset.asset,
      policyId: asset.policy_id,
      fingerprint: asset.fingerprint,
      assetName: getAssetName(asset),
      image: getAssetImage(asset),
      metadata: asset.onchain_metadata,
      rarity: rarity
    });
  }

  return assets;
};

const getAssetName = (asset: BlockfrostAssetType) => {
  return asset.onchain_metadata.name;
};

const getAssetImage = (asset: BlockfrostAssetType) => {
  return asset.onchain_metadata.image;
};

const generateAssetRarity = (
  asset: BlockfrostAssetType,
  rarityMap: object,
  assetCount: number,
  attributeKeyAndPath: {[key: string]: string}
) => {
  const rarity: AssetRarity = {score: 0, rank: 0};
  let score = 0;

  for (const [key, value] of Object.entries(rarityMap)) {
    const path = attributeKeyAndPath[key];
    const assetValue = extractKeyValue(asset.onchain_metadata, path);

    if (assetValue == null) {
      const count = value["None"];
      const valueRarity = count / assetCount;
      rarity[key] = {value: "None", rarity: valueRarity};
      score += valueRarity;
    } else {
      const count = value[assetValue];
      const valueRarity = count / assetCount;
      rarity[key] = {value: assetValue, rarity: valueRarity};
      score += valueRarity;
    }
  }

  rarity["score"] = score;
  return rarity;
};

const persistRarityData = async (
  assets: AssetType[],
  policyId: string,
  projectName: string,
  assetCount: number,
  rarityMap: object
) => {
  const existingProject = await projectRepository.getByPolicyId(policyId);

  if (existingProject == null)
    await projectRepository.add({policyId, projectName, size: assetCount, properties: rarityMap});
  else
    await projectRepository.update(existingProject._id, {
      policyId,
      projectName,
      size: assetCount,
      properties: rarityMap
    });

  for (const asset of assets) {
    await assetRepository.upsert(asset);
  }
};

const extractKeyValue = (metadata: {[key: string]: any}, key: string) => {
  if (!key.includes(".")) return metadata[key];

  const splittedKey = key.split(".");

  for (let i = 0, n = splittedKey.length; i < n; ++i) {
    const key: string = splittedKey[i];
    if (Object.prototype.hasOwnProperty.call(metadata, key)) {
      metadata = metadata[key];
    } else {
      return;
    }
  }

  return metadata;
};

export {generatePolicyRarity, deletePolicyIdData};
