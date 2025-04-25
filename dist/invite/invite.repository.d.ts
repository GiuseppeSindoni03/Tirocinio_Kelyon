import { Repository } from "typeorm";
import { Invite } from "./invite.entity";
export declare class InviteRepository extends Repository<Invite> {
    private readonly repository;
    constructor(repository: Repository<Invite>);
}
