/* eslint-disable no-unused-vars */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: string;

      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASS: string;
      DB_NAME: string;

      REST_API_KEY: string;
      REDIRECT_URI: string;

      LIST_TABLE: string;
      USER_TABLE: string;
      MEET_TABLE: string;
      MEET_HISTORY_TABLE: string;

      STATUS_INIT: string;
      STATUS_SUCCESS: string;
      STATUS_FAIL: string;
    }
  }
}

export {};
