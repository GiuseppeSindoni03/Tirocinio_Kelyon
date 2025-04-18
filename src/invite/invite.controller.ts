import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { Invite } from './invite.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AcceptInviteDto } from '../invite/dto/accept-invite.dto';
import { RequestWithUser } from 'src/types/request-with-user.interface';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  @Roles('DOCTOR')
  async createInvite(
    @Req() req: RequestWithUser,
    @Body() inviteDto: CreateInviteDto,
  ): Promise<Invite> {
    const user = req.user;
    return this.inviteService.createInvite(inviteDto, user.id);
  }

  @Post('/:id/accept')
  async acceptInvite(@Req() req, @Body() acceptInviteDto: AcceptInviteDto) {
    const invite = req.params.id;
    return this.inviteService.acceptInvite(acceptInviteDto, invite);
  }
}
