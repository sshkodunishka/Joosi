import { Descriptions } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateClassDto {
  readonly videoLink: string;

  readonly imageLink: string;

  @IsNotEmpty()
  readonly title: string;

  readonly description: string;

  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  readonly danceStyles: string[];
}
