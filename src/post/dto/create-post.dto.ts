import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  hashtags: string[];

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  files: any[];

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => MediaDto)
  // medias: MediaDto[];
}
