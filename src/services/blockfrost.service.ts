// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios").default;

import {BlockfrostAssetType} from "../types/blockfrost-asset.type";

const getAssetsFromPolicyId = async (
  policyId: string,
  projectId: string,
  page: number
): Promise<{asset: string; quantity: number}[]> => {
  try {
    const response = await axios.get(
      `https://cardano-mainnet.blockfrost.io/api/v0/assets/policy/${policyId}?page=${page}`,
      {
        headers: {
          project_id: projectId
        }
      }
    );

    return response.data;
  } catch (error) {
    console.log(error.response.data.message);
    throw error.response.data.message;
  }
};

const getAssetInfo = async (assetId: string, projectId: string): Promise<BlockfrostAssetType> => {
  try {
    const response = await axios.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${assetId}`, {
      headers: {
        project_id: projectId
      }
    });

    return response.data;
  } catch (error) {
    console.log(error.response.data.message);
    throw error.response.data.message;
  }
};

export {getAssetsFromPolicyId, getAssetInfo};
