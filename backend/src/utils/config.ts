const appName: string = 'visibility-backend_service';
// import dotenv from "dotenv";
import * as dotenv from 'dotenv';
dotenv.config();



export const config = {
    appName,
    environment: process.env.NODE_ENV,
    web: {
        port: parseInt(process.env.APP_PORT),
    },
    emailConfig: {
        password: process.env.EMAIL_PASSWORD,
        email: process.env.EMAIL,
      },
    logging: {
        file: process.env.LOG_PATH,
        level: process.env.LOG_LEVEL,
        console: process.env.LOG_ENABLE_CONSOLE || true,
    },
    jwt: {
        issuer: 'decagon_country_directory',
        algorithm: process.env.JWT_ALGORITHM,
        secret: process.env.AUTH_ENCRYPTION_SECRET || 'nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvJOOcLZlHOODbWzjY4whNLZDs' ,
 
        // private_key: process.env.JWT_PRIVATE_KEY,
        private_key: process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n'),
        public_key: process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n'),
    },
    mysql: {
        connection: {
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT) || 3306,
            database: process.env.DATABASE_NAME,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            debug: process.env.DATABASE_DEBUG || false,
        },
        pool: {
            min: (process.env.DATABASE_POOL_MIN) ? parseInt(process.env.DATABASE_POOL_MIN) : 2,
            max: (process.env.DATABASE_POOL_MAX) ? parseInt(process.env.DATABASE_POOL_MAX) : 2,
        },
    },
    countrylayer: {
        baseurl: process.env.COUNTRY_LAYER_URL,
        api_key: process.env.COUNTRY_LAYER_API_KEY,
        timeout: parseInt(process.env.COUNTRY_LAYER_REQUEST_TIMEOUT),
        retry: {
            count: parseInt(process.env.COUNTRY_LAYER_RETRY_COUNT),
            delay: parseInt(process.env.COUNTRY_LAYER_RETRY_DELAY),
        },
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT) || 6379,
        db: parseInt(process.env.REDIS_DB) || 1,
    },
    frontend: {
        host: process.env.FRONTEND_URL,
    },
    auth: {
        baseurl:  process.env.AUTH_BASEURL || '0.0.0.0:32770/v1/' ,
        secret: process.env.AUTH_ENCRYPTION_SECRET || 'nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvJOOcLZlHOODbWzjY4whNLZDs' 
    },
    max_rate_limit_counter: process.env.MAX_RATE_LIMIT_COUNTER || 30,
};
