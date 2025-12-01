import { ApiProperty} from '@nestjs/swagger';
import { IsString, IsNotEmpty,} from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: "Nom de l'utilisateur" })
  @IsNotEmpty()
  @IsString()
  username!: string;

  @ApiProperty({ description: "Mot de passe de l'utilisateur" })
  @IsNotEmpty()
  @IsString()
  password!: string;
}