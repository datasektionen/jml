import { Request } from "express";
import { KthUser } from "./types";
export interface IUserRequest extends Request {
    user?: KthUser
}