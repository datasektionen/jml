import ApiResponse from '../../common/ApiResponse';
import { StatusCodes } from 'http-status-codes';

export const ping = (): ApiResponse => {
    return {
        body: "pong",
    };
};