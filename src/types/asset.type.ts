import {AssetRarity} from "../types/asset-rarity.type";

export interface AssetType {
  blockfrostId: string;
  policyId: string;
  fingerprint: string;
  assetName: string;
  image: string;
  metadata: {[key: string]: unknown};
  rarity: AssetRarity;
}
