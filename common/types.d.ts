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

declare global {
    namespace Express {
      interface Request {
        user?: OidcUser;
      }
    }
}