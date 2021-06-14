import { User } from "./user.model";

export interface SessionData {
    idToken: string,
    expiresIn: number,
    user: User
}