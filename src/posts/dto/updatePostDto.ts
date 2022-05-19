import { IsOptional, IsString } from 'class-validator';
export class updatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  body?: string;
}
