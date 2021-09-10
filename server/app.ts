import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import apiRouter from './routes/api';
// Loads env variables
import configuration from './common/configuration';

const app = express();
app.use(cors());
app.use(express.json());

// Log requests to console
// Don't log when NODE_ENV == testing
if (configuration.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else if (configuration.NODE_ENV === "production") {
    app.use(morgan("common"));
}

app.use("/api", apiRouter);

// Serve React app
app.use(express.static("../client/build"));
// app.get("*", (req, res) => )

const PORT = configuration.PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

export default app;