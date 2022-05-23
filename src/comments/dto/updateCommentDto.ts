import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class updateCommentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
