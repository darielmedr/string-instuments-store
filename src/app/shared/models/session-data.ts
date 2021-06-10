import { User } from "./user";

export interface SessionData {
    idToken: string,
    expiresIn: number,
    user: User
}