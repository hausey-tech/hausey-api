declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;

    DATABASE_URL: string;

    JWT_SECRET: string;

    TWILIO_ACCOUNT_SID: string;
    TWILIO_API_KEY: string;
    TWILIO_API_SECRET: string;

    MEMED_URL: string;
    MEMED_API_KEY: string;
    MEMED_SECRET_KEY: string;

    STRIPE_SECRET_KEY: string;
    STRIPE_ENDPOINT_SECRET: string;

    AWS_BUCKET_NAME: string;
    AWS_BUCKET_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_MAX_FILE_SIZE: number;
  }
}
