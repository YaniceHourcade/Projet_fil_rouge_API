import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty({ example: 'Thriller', description: 'Le nom de l’album' })
  title!: string;

  @ApiProperty({ example: 1982, description: 'Année de sortie' })
  year!: number;

  @ApiProperty({ example: 9, description: 'Nombre de chansons' })
  song!: number;

  @ApiProperty({ example: 1, description: 'ID de l’artiste' })
  artistId!: number;
}
