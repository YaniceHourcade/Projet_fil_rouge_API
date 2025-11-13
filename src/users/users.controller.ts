import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { UsersDto } from './users.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserConnected(@Req() req: any): Promise<User> {
    const id = req.user.id;
    return this.userService.findUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    type: Number,
    description: "Identifiant unique de l'utilisateur",
  })
  @Get(':id')
  getUser(@Param('id') id: number) : Promise<User> { 
    return this.userService.findUser(id);
  }

  @ApiParam({
    name: 'artistId',
    type: String,
    description: "Id de l'artiste",
  })
  @UseGuards(JwtAuthGuard)
  @Patch('fav/add/:artistId')
  @ApiOperation({ summary: 'Ajouter en favoris' })
  async addFav(@Req() req: any, @Param('artistId') artistId: number): Promise<User> {
    const userId = req.user.id;
    return this.userService.addFav(userId, artistId);
  }

  @ApiParam({
    name: 'artistId',
    type: String,
    description: "Id de l'artiste",
  })
  @UseGuards(JwtAuthGuard)
  @Patch('fav/del/:artistId')
  @ApiOperation({ summary: 'Enlever en favoris' })
  async delFav(@Req() req: any, @Param('artistId') artistId: number): Promise<User> {
    const userId = req.user.id;
    return this.userService.addFav(userId, artistId);
  }
}
