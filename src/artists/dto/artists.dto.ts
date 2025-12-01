import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsUrl, Min, Max, IsOptional, IsNotEmpty } from 'class-validator';

export class ArtistDto {
  @ApiProperty({ description: "Nom de l'artiste" })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Genre musical' })
  @IsNotEmpty()
  @IsString()
  genre!: string;

  @ApiPropertyOptional({ description: "Âge de l'artiste" })
  @IsInt()
  @Min(10)
  @Max(120)
  age?: number;

  @ApiProperty({ description: "Pays de l'artiste" })
  @IsNotEmpty()
  @IsString()
  country!: string;

  @ApiPropertyOptional({ description: "URL Spotify de l'artiste" })
  @IsOptional()
  @IsUrl()
  url?: string;
}
