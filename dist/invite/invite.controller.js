"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteController = void 0;
const common_1 = require("@nestjs/common");
const invite_service_1 = require("./invite.service");
const create_invite_dto_1 = require("./dto/create-invite.dto");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const role_decorator_1 = require("../auth/decorators/role.decorator");
const accept_invite_dto_1 = require("./dto/accept-invite.dto");
let InviteController = class InviteController {
    inviteService;
    constructor(inviteService) {
        this.inviteService = inviteService;
    }
    async createInvite(req, inviteDto) {
        const user = req.user;
        return this.inviteService.createInvite(inviteDto, user);
    }
    async acceptInvite(req, acceptInviteDto) {
        const invite = req.params.id;
        return this.inviteService.acceptInvite(acceptInviteDto, invite);
    }
};
exports.InviteController = InviteController;
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/create'),
    (0, role_decorator_1.Roles)('DOCTOR'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_invite_dto_1.CreateInviteDto]),
    __metadata("design:returntype", Promise)
], InviteController.prototype, "createInvite", null);
__decorate([
    (0, common_1.Post)('/accept/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, accept_invite_dto_1.AcceptInviteDto]),
    __metadata("design:returntype", Promise)
], InviteController.prototype, "acceptInvite", null);
exports.InviteController = InviteController = __decorate([
    (0, common_1.Controller)('invite'),
    __metadata("design:paramtypes", [invite_service_1.InviteService])
], InviteController);
//# sourceMappingURL=invite.controller.js.map