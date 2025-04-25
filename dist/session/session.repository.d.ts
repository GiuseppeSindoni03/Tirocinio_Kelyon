import { Session } from "inspector/promises";
import { Repository } from "typeorm";
export declare class SessionRepository extends Repository<Session> {
    private readonly repository;
    constructor(repository: Repository<Session>);
}
