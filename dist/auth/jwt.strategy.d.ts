import { Strategy } from 'passport-jwt';
import { JwtPayload } from "./dto/jtw-payload.interface";
import { ConfigService } from "@nestjs/config";
import { Session } from "src/session/session.entity";
import { Repository } from "typeorm";
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly sessionRepository;
    private readonly configService;
    constructor(sessionRepository: Repository<Session>, configService: ConfigService);
    validate(payload: JwtPayload): Promise<import("../user/user.entity").User>;
}
export {};
