import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from "path";
import session from 'express-session';

import apiRouter from './routes/api';
import configuration from './common/configuration';
import prisma from './common/client';
import { OidcUser } from 'common/types';

const app = express();
app.use(cors());
app.use(express.json());

app.use(session({
    secret: configuration.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

let client: any;

async function initOIDC() {
    const { Issuer } = await import('openid-client');
    const issuer = await Issuer.discover(configuration.OIDC_ISSUER!);

    client = new issuer.Client({
        client_id: configuration.OIDC_CLIENT_ID,
        client_secret: configuration.OIDC_CLIENT_SECRET,
        redirect_uris: [configuration.REDIRECT_URL],
    });

    console.log('OIDC client initialized');
}

initOIDC();

app.get('/login', (req, res) => {
    const authUrl = client.authorizationUrl({
        scope: 'openid profile email permissions',
    });

    res.redirect(authUrl);
});

// Callback
app.get('/oidc/callback', async (req, res, next) => {
    try {
        const params = client.callbackParams(req);
        const tokenSet = await client.callback(
            configuration.REDIRECT_URL,
            params
        );
        const user = await client.userinfo(tokenSet.access_token)
        req.session.user = user

        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

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
}, 3600 * 1000)

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
