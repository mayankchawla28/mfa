import { IsNotEmpty, IsString } from "class-validator";

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  readonly id!: string;

  @IsNotEmpty()
  @IsString()
  readonly otp!: string;

  @IsNotEmpty()
  @IsString()
  readonly secret!: string;
}
