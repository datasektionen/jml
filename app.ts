import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from "path";
import session from 'express-session';
import { auth } from 'express-openid-connect';

import apiRouter from './routes/api';
import configuration from './common/configuration';
import prisma from './common/client';

const app = express();
app.use(cors());
app.use(express.json());

app.use(session({
    secret: configuration.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: configuration.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(auth({
    authRequired: false,
    auth0Logout: true,
    baseURL: configuration.OIDC_BASE_URL,
    clientID: configuration.OIDC_CLIENT_ID!,
    clientSecret: configuration.OIDC_CLIENT_SECRET!,
    issuerBaseURL: configuration.OIDC_ISSUER_BASE_URL!,
    secret: configuration.SESSION_SECRET!,
    routes: {
        login: "/api/login",
        callback: "/api/callback",
        logout: "/api/logout",
    },
    authorizationParams: {
        response_type: 'code',
        scope: 'openid profile email permissions',
    },
}));

app.use((req, res, next) => {
    next();
})

setInterval(() => {
    (async () => {
        const cases = await prisma.case.findMany();
        const toDelete = [];
        for (const c of cases) {
            if (c.delete && c.delete?.getTime() > Date.now()) {
                toDelete.push(c.id)
            }
        }
        for (const id of toDelete) {
            prisma.case.delete({
                where: {
                    id
                }
            })
            .then(() => {
                console.log(`Deleted ${id}`)
            })
        }
    })()
}, 3600*1000)

// Log requests to console
// Don't log when NODE_ENV == testing
if (configuration.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else if (configuration.NODE_ENV === "production") {
    app.use(morgan("common"));
}

app.use("/api", apiRouter);

// Serve React app
app.use(express.static("./client/build"));
app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "client", "build", "index.html")))

const PORT = configuration.PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

export default app;
