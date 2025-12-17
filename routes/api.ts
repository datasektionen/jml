import express from 'express';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();

import { ping } from '../functions/api/ping';
import caseRouter from './case';
import { silentAuthorization } from '../common/middlewares';

router.use("/case", caseRouter);

router.get("/check-token",
    silentAuthorization,
async (req, res) => {
    if (!req.user) return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
    });
    return res.status(StatusCodes.OK).json(req.user);
});

router.get("/ping", (req, res) => {
    res.json(ping());
});

router.get("*", (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        body: "Invalid API path"
    });
});

export default router;
