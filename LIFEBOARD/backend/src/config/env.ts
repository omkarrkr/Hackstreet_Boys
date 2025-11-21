import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  supabase: {
    url: string;
    anonKey: string;
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiry: string;
    refreshExpiry: string;
  };
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env: EnvConfig = {
  port: parseInt(getEnvVar('PORT', '5000'), 10),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  supabase: {
    url: getEnvVar('SUPABASE_URL'),
    anonKey: getEnvVar('SUPABASE_ANON_KEY'),
  },
  jwt: {
    accessSecret: getEnvVar('JWT_ACCESS_SECRET'),
    refreshSecret: getEnvVar('JWT_REFRESH_SECRET'),
    accessExpiry: getEnvVar('JWT_ACCESS_EXPIRY', '15m'),
    refreshExpiry: getEnvVar('JWT_REFRESH_EXPIRY', '7d'),
  },
};
