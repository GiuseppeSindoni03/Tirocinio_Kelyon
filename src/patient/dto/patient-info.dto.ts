import { IsNotEmpty, IsString } from "class-validator";

export class PatientInfoDto {

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    cap: string;

    @IsString()
    @IsNotEmpty()
    province: string;

}