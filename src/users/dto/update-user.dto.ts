import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly lastName: string;

  readonly photoLink: string;

  readonly description: string;
}

export class UpdateUserImamgeDto {
  readonly photoLink: string;
}
