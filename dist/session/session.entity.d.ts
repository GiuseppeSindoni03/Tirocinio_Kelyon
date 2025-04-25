import { User } from "src/user/user.entity";
export declare class Session {
    id: number;
    user: User;
    refreshToken: string;
    deviceInfo: string;
    ipAddress: string;
    createdAt: Date;
    expiresAt: Date;
}
