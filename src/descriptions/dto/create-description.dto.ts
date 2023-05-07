import { IsNotEmpty } from 'class-validator';

export class CreateDescriptionDto {
  @IsNotEmpty()
  readonly classId: number;

  @IsNotEmpty()
  readonly countOfPeople: number;

  @IsNotEmpty()
  readonly eventDate: Date;

  @IsNotEmpty()
  readonly place: string;

  @IsNotEmpty()
  readonly price: number;
}
