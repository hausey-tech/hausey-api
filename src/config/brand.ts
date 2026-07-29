/** Seller do canal Easy Clinic (mesmo id usado no hausey-web: src/config/easyClinic.ts) */
export const EC_SELLER_ID =
  process.env.EC_SELLER_ID ?? '4c3e0608-bfd7-4d52-9972-28df8d94d2c0';

export const EC_APP_URL = process.env.EC_APP_URL ?? 'https://easyclinic24.com';

export const isEcHolder = (sellerId?: string | null): boolean =>
  sellerId === EC_SELLER_ID;
