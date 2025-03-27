import { IsNotEmpty, IsStrongPassword } from "class-validator";


export class AcceptInviteDto {
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}