import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';

export class UsersDto {
  @ApiProperty({ description: "Nom de l'utilisateur" })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ description: "Adresse email de l'utilisateur" })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ description: "Âge de l'utilisateur" })
  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(120)
  age?: number;

  @ApiPropertyOptional({ description: "Pays de l'utilisateur" })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: "Mot de passe de l'utilisateur" })
  @IsNotEmpty()
  @IsString()
  password!: string;
}