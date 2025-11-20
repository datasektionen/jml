import dotenv from 'dotenv';
// Read from the .env-file
dotenv.config();

if (!process.env.OIDC_CLIENT_ID && process.env.NODE_ENV !== "testing") {
    console.log("No OIDC_CLIENT_ID set. Exiting...");
    process.exit(-1);
}

if (!process.env.OIDC_CLIENT_SECRET && process.env.NODE_ENV !== "testing") {
    console.log("No OIDC_CLIENT_SECRET set. Exiting...");
    process.exit(-1);
}

if (!process.env.OIDC_ISSUER_BASE_URL && process.env.NODE_ENV !== "testing") {
    console.log("No OIDC_ISSUER_BASE_URL set. Exiting...");
    process.exit(-1);
}

if (!process.env.SESSION_SECRET && process.env.NODE_ENV !== "testing") {
    console.log("No SESSION_SECRET set. Exiting...");
    process.exit(-1);
}

const configuration = {
    PORT: process.env.PORT ?? 8080,
    NODE_ENV: process.env.NODE_ENV ?? "production",
    OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID,
    OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET,
    OIDC_ISSUER_BASE_URL: process.env.OIDC_ISSUER_BASE_URL,
    OIDC_BASE_URL: process.env.OIDC_BASE_URL ?? `http://localhost:${process.env.PORT ?? 8080}`,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SPAM_API_URL: process.env.SPAM_API_URL ?? "https://spam.datasektionen.se/api",
    SPAM_API_KEY: process.env.SPAM_API_KEY,
    SEND_MAIL_IN_DEVELOPMENT: Boolean(process.env.SEND_MAIL_IN_DEVELOPMENT ?? false),
    DEVELOPMENT_ADMIN_EMAIL: process.env.DEVELOPMENT_ADMIN_EMAIL,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    GOOGLE_RECAPTCHA_API_URL: process.env.GOOGLE_RECAPTCHA_API_URL ?? "https://www.google.com/recaptcha/api/siteverify",
};

if (configuration.NODE_ENV === "development" && configuration.SEND_MAIL_IN_DEVELOPMENT === true && !configuration.SPAM_API_KEY) {
    console.log("No SPAM_API_KEY set. Exiting...");
    process.exit(-1);
}

if (!configuration.RECAPTCHA_SECRET_KEY) {
    console.log("No RECAPTCHA_SECRET_KEY set. Exiting...");
    process.exit(-1);
}

export default configuration;
