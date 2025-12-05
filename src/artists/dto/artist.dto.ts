import { ApiProperty} from '@nestjs/swagger';
import { IsString, IsInt, IsUrl, Min, Max, IsNotEmpty, IsIn } from 'class-validator';


export class ArtistDto {
  @ApiProperty({ description: "Nom de l'artiste" })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Genre musical' })
  @IsNotEmpty()
  @IsString()
  genre!: string;

  @ApiProperty({ description: "Âge de l'artiste" })
  @IsInt()
  @Min(10)
  @Max(120)
  age!: number;

  @ApiProperty({ description: "Pays de l'artiste" })
  @IsNotEmpty()
  @IsString()
  @IsIn(['EN', 'FR', 'ES', 'IT', 'DE', 'PT', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'EE', 'LT', 'LV', 'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'AL', 'MK', 'ME', 'RS', 'HR', 'BA', 'XK'])
  country!: string;

  @ApiProperty({ description: "URL Spotify de l'artiste" })
  @IsUrl()
  url!: string;
}
