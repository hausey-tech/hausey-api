declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    JWT_SECRET: string;

    TWILIO_ACCOUNT_SID: string;
    TWILIO_API_KEY: string;
    TWILIO_API_SECRET: string;

    MEMED_URL: string;
    MEMED_API_KEY: string;
    MEMED_SECRET_KEY: string;
  }
}
