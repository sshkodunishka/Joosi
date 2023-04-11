import { IsNotEmpty } from 'class-validator';

export class CreateDescriptionDto {
  readonly videoLink: string;

  readonly style: string;

  readonly description: string;

  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  readonly countOfPeople: number;

  @IsNotEmpty()
  readonly evenDate: Date;

  @IsNotEmpty()
  readonly place: string;
}
