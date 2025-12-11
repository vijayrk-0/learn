/**
 * Environment variable validation
 * Validates required environment variables at startup
 */

const requiredEnvVars = {
    JWT_SECRET: process.env.JWT_SECRET,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
} as const;

export function validateEnv() {
    const missing: string[] = [];

    for (const [key, value] of Object.entries(requiredEnvVars)) {
        if (!value) {
            missing.push(key);
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}. ` +
            `Please check your .env file.`
        );
    }
}

// Validate on module load in server-side code
if (typeof window === 'undefined') {
    validateEnv();
}

export const env = {
    JWT_SECRET: process.env.JWT_SECRET!,
    SMTP_USER: process.env.SMTP_USER!,
    SMTP_PASS: process.env.SMTP_PASS!,
} as const;
