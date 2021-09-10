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
        user?: KthUser
      }
    }
}