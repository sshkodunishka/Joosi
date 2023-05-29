import { IsNotEmpty } from 'class-validator';

export class CreateClassDto {
  readonly videoLink: string;

  readonly imageLink: string;

  @IsNotEmpty()
  readonly title: string;

  readonly description: string;

  @IsNotEmpty()
  readonly danceStylesId: number[];
}
