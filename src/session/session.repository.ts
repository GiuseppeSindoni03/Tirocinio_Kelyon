import { Injectable } from "@nestjs/common";
import { Session } from "inspector/promises";
import { Repository } from "typeorm";

@Injectable()
export class SessionRepository extends Repository <Session> {

    constructor (
        private readonly repository: Repository<Session>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner
        );
    }

}