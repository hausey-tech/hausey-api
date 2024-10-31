export interface ICreateBankAccount {
  id: string;
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
    // stripe
    country: string;
    currency: string;
    routingNumber: string;
  };
}
