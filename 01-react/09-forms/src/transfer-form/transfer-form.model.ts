export interface TransferFormEntity {
  account: string;
  beneficiary: string;
  integerAmount: number;
  decimalAmount: number;
  reference: string;
  email: string;
}

export const createEmptyTransferFormEntity = (): TransferFormEntity => ({
  account: "",
  beneficiary: "",
  integerAmount: 0,
  decimalAmount: 0,
  reference: "",
  email: "",
});
