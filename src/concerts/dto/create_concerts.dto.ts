import { ApiProperty } from '@nestjs/swagger';

export class CreateConcertDto {
  @ApiProperty({ example: 'Live in Paris', description: 'Le nom du concert' })
  location!: string;

  @ApiProperty({ example: '2023-09-15', description: 'Date du concert' })
  date!: Date;

  @ApiProperty({ example: 5000, description: 'Capacité du concert' })
  place!: number;

  @ApiProperty({ example: 1, description: 'ID de l’artiste' })
  artistId!: number;
}