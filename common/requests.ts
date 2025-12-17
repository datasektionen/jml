import { Request } from "express";
import { OidcUser } from "./types";
export interface IUserRequest extends Request {
    user?: OidcUser
}
