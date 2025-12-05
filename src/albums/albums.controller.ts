import { Controller, Get, Post, Delete, Body, Put, Param, UseGuards, Patch } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { Album } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AlbumDto } from './dto/album.dto';
import { RolesGuard } from '../auth/role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Albums')
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Récupérer tous les albums',
    description: 'Retourne la liste de tous les albums disponibles. Route publique, aucune authentification requise.'
  })
  @ApiResponse({ status: 200, description: 'Liste des albums', type: AlbumDto, isArray: true })
  async findAll(): Promise<Album[]> {
    return this.albumsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Récupérer un album par ID',
    description: 'Retourne les informations détaillées d\'un album spécifique. Route publique, aucune authentification requise.'
  })
  @ApiParam({ name: 'id', type: Number, description: "ID de l'album" })
  @ApiResponse({ status: 200, description: 'Album trouvé', type: AlbumDto})
  @ApiResponse({ status: 404, description: 'Album non trouvé' })
  async findOne(@Param('id') id: string): Promise<Album | null> {
    return this.albumsService.findOne(Number(id));
  }

  @Get('artist/:artistId')
  @ApiOperation({ 
    summary: 'Récupérer des albums par ID d\'artiste',
    description: 'Retourne tous les albums d\'un artiste spécifique. Route publique, aucune authentification requise.'
  })
  @ApiParam({ name: 'artistId', type: Number, description: "ID de l'artiste" })
  @ApiResponse({ status: 200, description: 'Albums trouvés', type: AlbumDto, isArray: true })
  async findByArtistId(@Param('artistId') artistId: string): Promise<Album[]> {
    return this.albumsService.findByArtistId(Number(artistId));
  }

  @Get('genre/:genre')
  @ApiOperation({ 
    summary: 'Récupérer des albums par genre',
    description: 'Retourne tous les albums d\'un genre musical spécifique. Route publique, aucune authentification requise.'
  })
  @ApiParam({ name: 'genre', type: String, description: "Genre musical" })
  @ApiResponse({ status: 200, description: 'Albums trouvés', type: AlbumDto, isArray: true })
  async findByStyle(@Param('genre') genre: string) {
    return this.albumsService.findByGenre(genre);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ 
    summary: 'Créer un nouvel album',
    description: 'Crée un nouvel album dans la base de données. Nécessite une authentification JWT avec le rôle ADMIN uniquement.'
  })
  @ApiBody({ type: AlbumDto })
  @ApiResponse({ status: 201, description: 'Album créé avec succès', type: AlbumDto })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle admin requis' })
  async create(
    @Body() AlbumDto: AlbumDto,
  ): Promise<Album> {
    return this.albumsService.create(AlbumDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Supprimer un album',
    description: 'Supprime définitivement un album de la base de données. Nécessite une authentification JWT avec le rôle ADMIN uniquement.'
  })
  @ApiParam({ name: 'id', type: Number, description: "ID de l'album à supprimer" })
  @ApiResponse({ status: 200, description: 'Album supprimé avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle admin requis' })
  @ApiResponse({ status: 404, description: 'Album non trouvé' })
  async deleteOne(@Param('id') id: string): Promise<{ message: string }> {
    await this.albumsService.deleteOne(Number(id));
    return { message: `Album avec l'id ${id} supprimé avec succès.` };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Mettre à jour un album',
    description: 'Met à jour les informations d\'un album existant. Seuls les champs fournis seront modifiés (mise à jour partielle). Nécessite une authentification JWT avec le rôle ADMIN uniquement.'
  })
  @ApiParam({ name: 'id', type: Number, description: "ID de l'album à modifier" })
  @ApiBody({ type: AlbumDto })
  @ApiResponse({ status: 200, description: 'Album mis à jour avec succès', type: AlbumDto })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle admin requis' })
  @ApiResponse({ status: 404, description: 'Album non trouvé' })
  async update(
    @Param('id') id: string,
    @Body() body: Partial<AlbumDto>,
  ): Promise<Album> {
    return this.albumsService.update(Number(id), body);
  }
}
