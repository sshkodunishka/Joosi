import { Descriptions } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateClassDto {
  readonly videoLink: string;

  @IsNotEmpty()
  readonly styleId: number;

  readonly description: string;

  @IsNotEmpty()
  readonly price: number;
}
