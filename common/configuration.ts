import dotenv from 'dotenv';
// Read from the .env-file
dotenv.config();

if (!process.env.LOGIN_API_KEY && process.env.NODE_ENV !== "testing") {
    console.log("No LOGIN_API_KEY set. Exiting...");
    process.exit(-1);
}

const configuration = {
    PORT: process.env.PORT ?? 8080,
    NODE_ENV: process.env.NODE_ENV ?? "production",
    PLS_API_URL: process.env.PLS_API_URL ?? "https://pls.datasektionen.se/api",
    LOGIN_API_URL: process.env.LOGIN_API_URL ?? "https://login.datasektionen.se",
    LOGIN_API_KEY: process.env.LOGIN_API_KEY,
    SPAM_API_URL: process.env.SPAM_API_URL ?? "https://spam.datasektionen.se/api",
    SPAM_API_KEY: process.env.SPAM_API_KEY,
    SEND_MAIL_IN_DEVELOPMENT: Boolean(process.env.SEND_MAIL_IN_DEVELOPMENT ?? false),
    // What user to send emails to in development
    DEVELOPMENT_ADMIN_EMAIL: process.env.DEVELOPMENT_ADMIN_EMAIL,
};

if (configuration.NODE_ENV === "development" && configuration.SEND_MAIL_IN_DEVELOPMENT === true && !configuration.SPAM_API_KEY) {
    console.log("No SPAM_API_KEY set. Exiting...");
    process.exit(-1);
}

export default configuration;