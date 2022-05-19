import { IsNotEmpty, IsInt } from 'class-validator';

export class getOnePostDto {
  @IsNotEmpty()
  @IsInt()
  id: string;
}
