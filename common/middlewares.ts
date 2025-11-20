import express from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { errorResponse, unauthorizedResponse } from './ApiResponse';
import configuration from './configuration';
import axios from 'axios';
import { OidcUser, Permission } from './types';
import { IUserRequest } from './requests';

export const verifyRecaptchaValue = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const body = {
        secret: configuration.RECAPTCHA_SECRET_KEY,
        response: req.body["g-recaptcha-response"],
    };

    return axios.post(`${configuration.GOOGLE_RECAPTCHA_API_URL}?secret=${body.secret}&response=${body.response}`)
        .then((result: any) => {
            if (result.data.success) return next();
            else return errorResponse(res, StatusCodes.BAD_REQUEST, "");
        })
        .catch((err: any) => {
            return errorResponse(res, StatusCodes.BAD_REQUEST, "");
        });
};

/**
 * Middleware that checks if there are any validation errors, if there are, it
 * sends 400 Bad Request. Otherwise it calls the next function in the chain.
 * @param req the request object
 * @param res the response object
 * @param next next function
 */
export const validationCheck = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errorResponse(res, StatusCodes.BAD_REQUEST, errors.array());
        return;
    }
    next();
};

export const authorizeOidc = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const oidc = (req as any).oidc;

    if (!oidc || !oidc.isAuthenticated()) {
        unauthorizedResponse(res);
        return;
    }

    const user = oidc.user as OidcUser;

    if (!user) {
        unauthorizedResponse(res);
        return;
    }

    const permissions = user.permissions || [];
    const isAdmin = permissions.some((p: Permission) => p.id === "admin");

    if (!isAdmin) {
        unauthorizedResponse(res);
        return;
    }

    req.user = { ...user, isAdmin };
    console.log(`User ${user.name || user.email} authenticated with admin permissions.`);

    next();
};

export const silentAuthorization = async (req: IUserRequest, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        const oidc = (req as any).oidc;

        if (!oidc || !oidc.isAuthenticated()) {
            next();
            return;
        }

        const user = oidc.user as OidcUser;

        if (!user) {
            next();
            return;
        }

        const permissions = user.permissions || [];
        const isAdmin = permissions.some((p: Permission) => p.id === "admin");

        req.user = { ...user, isAdmin };
        console.log(JSON.stringify({ sub: user.sub, email: user.email, isAdmin }));

        next();
    } catch (err) {
        console.error("silentAuthorization:", err);
        next();
    }
};
