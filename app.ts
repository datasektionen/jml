import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from "path";

import apiRouter from './routes/api';
// Loads env variables
import configuration from './common/configuration';
import prisma from './common/client';

const app = express();
app.use(cors());
app.use(express.json());

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
