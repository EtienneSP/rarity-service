export interface BlockfrostAssetType {
  asset: string;
  policy_id: string;
  asset_name: string;
  fingerprint: string;
  quantity: number;
  initial_mint_tx_hash: string;
  mint_or_burn_count: number;
  onchain_metadata: {
    [key: string]: never & {
      name: string;
      image: string;
    };
  };
  metadata: object;
}
