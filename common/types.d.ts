export interface Permission {
    id: string;
}

export interface OidcUser {
    sub: string;
    email?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    permissions?: Permission[];
    isAdmin?: boolean;
}

export interface KthUser {
    emails: string;
    first_name: string;
    last_name: string;
    ugkthid: string;
    user: string;
}

import 'express';

declare module 'express-serve-static-core' {
    interface Request {
        session: import('express-session').Session & {
            user?: OidcUser;
        };
        user?: OidcUser;
    }
}

