"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteRepository = void 0;
const typeorm_1 = require("typeorm");
class InviteRepository extends typeorm_1.Repository {
    repository;
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
}
exports.InviteRepository = InviteRepository;
//# sourceMappingURL=invite.repository.js.map