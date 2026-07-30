import { isBefore } from 'date-fns';

export const isPatientPlanActive = (patient: {
  isPro: boolean;
  planExpiresAt: Date | null;
}): boolean =>
  patient.isPro &&
  !!patient.planExpiresAt &&
  isBefore(new Date(), patient.planExpiresAt);
