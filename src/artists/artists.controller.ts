import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { Artist } from '@prisma/client';
import { ApiBody, ApiOperation, ApiParam} from '@nestjs/swagger';
import { ArtistDto } from './artists.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  async findAll(): Promise<Artist[]> {
    return this.artistsService.findAll();
  }

  @ApiParam({
    name: 'id',
    type: Number,
    description: "Identifiant unique de l'artiste",
  })
  @Get(':id')
  getArtist(@Param('id') id: number) : Promise<Artist> { 
    return this.artistsService.findArtist(id);
  }

  @ApiParam({
    name: 'name',
    type: String,
    description: "Nom de l'artiste",
  })
  @Get('search/:name')
  getArtistByName(@Param('name') name: string): Promise<Artist[]> {
    return this.artistsService.searchByName(name);
  }

  @ApiParam({
    name: 'genre',
    type: String,
    description: "Genre de musique",
  })
  @Get('genre/:genre')
  getArtistByGenre(@Param('genre') genre: string) : Promise<Artist[]> { 
    return this.artistsService.findArtistByGenre(genre);
  }

  @ApiParam({
    name: 'country',
    type: String,
    description: "Pays de l'artiste",
  })
  @Get('country/:country')
  getArtistByCountry(@Param('country') country: string) : Promise<Artist[]> { 
    return this.artistsService.findArtistByCountry(country);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiOperation({ summary: "Créer un nouvel artiste" })
  @ApiBody({ type: ArtistDto })
  async create(@Body() body: ArtistDto): Promise<Artist> {
    return this.artistsService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: "Supprimer un artiste" })
  async delete(@Param('id') id: number): Promise<Artist> {
    return this.artistsService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({summary: "Modifier un artiste" })
  @ApiBody({ type: ArtistDto })
  async update(@Body() body: ArtistDto, @Param('id') id: number): Promise<Artist> {
    return this.artistsService.update(id, body);
  }
}
