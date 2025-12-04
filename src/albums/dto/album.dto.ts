import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class AlbumDto {
  @ApiProperty({ example: 'Thriller', description: 'Le nom de l’album' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 1982, description: 'Année de sortie' })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  year!: number;

  @ApiProperty({ example: 9, description: 'Nombre de chansons' })
  @IsInt()
  @Min(1)
  song!: number;

  @ApiProperty({ example: 1, description: 'ID de l’artiste' })
  @IsInt()
  @Min(1)
  artistId!: number;
}
