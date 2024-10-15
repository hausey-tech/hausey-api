declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;

    DATABASE_URL: string;

    JWT_SECRET: string;

    TWILIO_ACCOUNT_SID: string;
    TWILIO_API_KEY: string;
    TWILIO_API_SECRET: string;

    EMAIL_HOST: string;
    EMAIL_PASS: string;
    EMAIL_PORT: string;
    EMAIL_USER: string;

    VIDEO_SDK_API_KEY: string;
    VIDEO_SDK_SECRET_KEY: string;

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

    PAGARME_URL: string;
    PAGARME_SECRET_KEY: string;
    PAGARME_RECIPIENT_ID: string;

    SURVEY_MONKEY_URL: string;
    SURVEY_MONKEY_KEY: string;

    NIPOMED_URL: string;
    NIPOMED_TOKEN: string;
  }
}
