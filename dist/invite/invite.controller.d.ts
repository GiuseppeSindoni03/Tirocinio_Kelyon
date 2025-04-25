import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { Invite } from './invite.entity';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { RequestWithUser } from 'src/types/request-with-user.interface';
export declare class InviteController {
    private readonly inviteService;
    constructor(inviteService: InviteService);
    createInvite(req: RequestWithUser, inviteDto: CreateInviteDto): Promise<Invite>;
    acceptInvite(req: any, acceptInviteDto: AcceptInviteDto): Promise<void>;
}
