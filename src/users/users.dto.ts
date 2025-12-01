import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UsersDto {
  @ApiProperty({ description: "Nom de l'utilisateur" })
  @IsNotEmpty()
  @IsString()
  username!: string;

  @ApiProperty({ description: "Mot de passe de l'utilisateur" })
  @IsNotEmpty()
  @IsString()
  password!: string;

  @ApiPropertyOptional({ description: "Rôle de l'utilisateur" })
  @IsOptional()
  @IsString()
  role?: string;
}