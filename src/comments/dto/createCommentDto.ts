import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createCommentDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
