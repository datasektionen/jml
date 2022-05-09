import express from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { errorResponse, unauthorizedResponse } from './ApiResponse';
import configuration from './configuration';
import axios from 'axios';
import { KthUser } from './types';
import { IUserRequest } from './requests';

/**
 * Verify the user recaptcha response with Googles' servers
 * 
 * If success, calls next(), else responds with 400
 * 
 */
export const verifyRecaptchaValue = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const body = {
        secret: configuration.RECAPTCHA_SECRET_KEY,
        response: req.body["g-recaptcha-response"],
    };

    return axios.post(`${configuration.GOOGLE_RECAPTCHA_API_URL}?secret=${body.secret}&response=${body.response}`)
    .then(result => {
        if (result.data.success) return next();
        else return errorResponse(res, StatusCodes.BAD_REQUEST, "");
    })
    .catch(err => {
        console.log(err);
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

// Authorizes token against pls.
export const authorizePls = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const authorizationHeader = req.headers.authorization;
    // Get token from "Bearer token"
    const token = authorizationHeader && authorizationHeader.split(" ")[1];
    if (!token || token.length === 0) {
        unauthorizedResponse(res);
        return;
    }

    if (configuration.NODE_ENV === "testing") {
        if (token === "admin") return next();
        unauthorizedResponse(res);
        return;
    }
    
    axios.get(`${configuration.LOGIN_API_URL}/verify/${token}.json?api_key=${configuration.LOGIN_API_KEY}`)
    .then(response => {
        if (response.status !== 200) {
            unauthorizedResponse(res);
            return;
        }

        const user = response.data as KthUser;

        axios.get(`${configuration.PLS_API_URL}/user/${user.user}/jml`)
        .then(r => {

            if (!r.data.includes("admin")) {
                unauthorizedResponse(res);
                return;
            }

            req.user = { ...response.data, admin: true } as KthUser;

            console.log(`User ${user.first_name} ${user.last_name} (${user.emails}) authenticated.`);

            next();
        })
        .catch(err => {
            unauthorizedResponse(res);
            return;
        }); 
    })
    .catch(err => {
        unauthorizedResponse(res);
        return;
    });
};

// Checks authorization but does not reject.
// Takes token either in Authorization header or as a query string
export const silentAuthorization = async (req: IUserRequest, res: express.Response, next: express.NextFunction): Promise<void> => {
    const authorizationHeader = req.headers.authorization;
    let token;
    if (authorizationHeader) {
        token = authorizationHeader.split(" ")[1];
    } else if (req.query.token) {
        token = req.query.token;
    }

    if (!token || token.length === 0) {
        next();
        return;
    }

    try {
        const response = await axios.get(`${configuration.LOGIN_API_URL}/verify/${token}.json?api_key=${configuration.LOGIN_API_KEY}`);
        if (response.status !== StatusCodes.OK) {
            next();
            return;
        }
        
        const user = response.data;
    
        const plsResponse = await axios.get(`${configuration.PLS_API_URL}/user/${user.user}/jml`);
        req.user = { ...user, admin: plsResponse.data };
    
        next();
    } catch (err) {
        next();
    }
};