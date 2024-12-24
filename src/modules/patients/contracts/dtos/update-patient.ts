export interface IUpdatePatientDTO {
  name?: string;
  document?: string;
  birthdate?: string;
  phoneNumber?: string;
  sex?: 'M' | 'F';
  planId?: string;
  planExpiresAt?: string;
  sellerId?: string;
  fcmToken?: string;
  responsibleTeamId?: string;
  password?: string;
  resetPasswordToken?: string | null;
  resetPasswordTokenExpiresIn?: Date | null;
  stripeCustomerId?: string;
  language?: string;
  region?: string;
  nipomed?: boolean;
  firstPayment?: boolean;
}
