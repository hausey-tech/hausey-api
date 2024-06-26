export interface IUpdateBankAccount {
  recipientId: string;
  bankAccount: {
    holderName: string;
    bank: string;
    branchNumber: string;
    branchCheckDigit?: string;
    accountNumber: string;
    accountCheckDigit: string;
    holderType: 'individual' | 'company';
    holderDocument: string;
    type: 'checking' | 'savings';
  };
}
