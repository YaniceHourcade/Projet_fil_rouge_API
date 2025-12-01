import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDateString, Min, IsNotEmpty } from 'class-validator';

export class CreateConcertDto {
  @ApiProperty({ example: 'Live in Paris', description: 'Le nom du concert' })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({ example: '2023-09-15', description: 'Date du concert' })
  @IsDateString()
  date!: string;

  @ApiProperty({ example: 5000, description: 'Capacité du concert' })
  @IsInt()
  @Min(1)
  place!: number;

  @ApiProperty({ example: 1, description: 'ID de l’artiste' })
  @IsInt()
  @Min(1)
  artistId!: number;
}
