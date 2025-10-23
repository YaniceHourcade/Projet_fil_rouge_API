import { Controller, Get, Post, Delete, Body, Put, Param } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { Albums } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateAlbumDto } from './dto/create_albums.dto';

@ApiTags('Albums')
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les albums' })
  @ApiResponse({ status: 200, description: 'Liste des albums', type: Object, isArray: true })
  async findAll(): Promise<Albums[]> {
    return this.albumsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un album par ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Album trouvé', type: Object })
  async findOne(@Param('id') id: string): Promise<Albums | null> {
    return this.albumsService.findOne(Number(id));
  }

  @Get('artist/:artistId')
  @ApiOperation({ summary: 'Récupérer des albums par ID d’artiste' })
  @ApiParam({ name: 'artistId', type: Number })
  @ApiResponse({ status: 200, description: 'Albums trouvés', type: Object, isArray: true })
  async findByArtistId(@Body('artistId') artistId: string): Promise<Albums[]> {
    return this.albumsService.findByArtistId(Number(artistId));
  }

  @Get('genre/:genre')
  @ApiOperation({ summary: 'Récupérer des albums par genre' })
  @ApiParam({ name: 'genre', type: String })
  @ApiResponse({ status: 200, description: 'Albums trouvés', type: Object, isArray: true })
  async findByStyle(@Param('genre') genre: string) {
    return this.albumsService.findByGenre(genre);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel album' })
  @ApiBody({ type: CreateAlbumDto })
  @ApiResponse({ status: 201, description: 'Album créé', type: Object })
  async create(
    @Body() createAlbumDto: CreateAlbumDto,
  ): Promise<Albums> {
    return this.albumsService.create(createAlbumDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Supprimer tous les albums' })
  @ApiResponse({ status: 200, description: 'Albums supprimés' })
  async deleteAll(): Promise<{ message: string; count: number}> { 
    const result = await this.albumsService.deleteAll();
    return {
      message: `${result.count} albums supprimés avec succès.`,
      count: result.count,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un album' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Album supprimé' })
  async deleteOne(@Param('id') id: string): Promise<{ message: string }> {
    await this.albumsService.deleteOne(Number(id));
    return { message: `Album avec l'id ${id} supprimé avec succès.` };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un album' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateAlbumDto })
  async update(
    @Param('id') id: string,
    @Body() body: Partial<Albums>,
  ): Promise<Albums> {
    return this.albumsService.update(Number(id), body);
  }
}
