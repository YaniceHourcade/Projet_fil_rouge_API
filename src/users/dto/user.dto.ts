import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class UserDto {
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
  @IsIn(['user', 'admin'])
  role?: 'user' | 'admin';
}