export class CreateUserDto {
  readonly id: number;

  readonly login: string;

  readonly password: string;

  readonly firstName: string;

  readonly lastName: string;
}
