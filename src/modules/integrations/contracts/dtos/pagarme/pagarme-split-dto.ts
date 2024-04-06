export interface IPagarmeSplitDTO {
  amount: number;
  recipient_id: string;
  type: string;
  options: {
    charge_remainder_fee: boolean;
    charge_processing_fee: boolean;
    liable: boolean;
  };
}
