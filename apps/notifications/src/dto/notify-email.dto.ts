import { IsEmail } from 'class-validator';

export class NofifyEmailDto {
  @IsEmail()
  email: string;
}
