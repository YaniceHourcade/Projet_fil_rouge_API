import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ArtistsService } from './artists.service';
import { Artist } from '@prisma/client';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import { ArtistDto } from './dto/artist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';

@ApiTags('Artists')
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Récupérer tous les artistes',
    description: 'Retourne la liste de tous les artistes avec leurs albums et concerts. Route publique, aucune authentification requise.'
  })
  @ApiResponse({ status: 200, description: 'Liste de tous les artistes', type: [ArtistDto] })
  async findAll(): Promise<Artist[]> {
    return this.artistsService.findAll();
  }

  @ApiParam({
    name: 'id',
    type: Number,
    description: "Identifiant unique de l'artiste",
  })
  @Get(':id')
  @ApiOperation({ 
    summary: 'Récupérer un artiste par ID',
    description: 'Retourne les informations détaillées d\'un artiste spécifique, y compris ses albums et concerts. Route publique, aucune authentification requise.'
  })
  @ApiResponse({ status: 200, description: 'Informations de l\'artiste', type: ArtistDto })
  @ApiResponse({ status: 404, description: 'Artiste non trouvé' })
  getArtist(@Param('id') id: number) : Promise<Artist> { 
    return this.artistsService.findArtist(id);
  }

  @ApiParam({
    name: 'name',
    type: String,
    description: "Nom de l'artiste (recherche partielle)",
  })
  @Get('search/:name')
  @ApiOperation({ 
    summary: 'Rechercher des artistes par nom',
    description: 'Recherche des artistes dont le nom contient la chaîne de caractères fournie. Route publique, aucune authentification requise.'
  })
  @ApiResponse({ status: 200, description: 'Liste des artistes correspondants', type: [ArtistDto] })
  getArtistByName(@Param('name') name: string): Promise<Artist[]> {
    return this.artistsService.searchByName(name);
  }

  @ApiParam({
    name: 'genre',
    type: String,
    description: "Genre de musique",
  })
  @Get('genre/:genre')
  @ApiOperation({ 
    summary: 'Récupérer des artistes par genre',
    description: 'Retourne tous les artistes d\'un genre musical spécifique. Route publique, aucune authentification requise.'
  })
  @ApiResponse({ status: 200, description: 'Liste des artistes du genre', type: [ArtistDto] })
  @ApiResponse({ status: 404, description: 'Aucun artiste trouvé pour ce genre' })
  getArtistByGenre(@Param('genre') genre: string) : Promise<Artist[]> { 
    return this.artistsService.findArtistByGenre(genre);
  }

  @ApiParam({
    name: 'country',
    type: String,
    description: "Pays de l'artiste",
  })
  @Get('country/:country')
  @ApiOperation({ 
    summary: 'Récupérer des artistes par pays',
    description: 'Retourne tous les artistes d\'un pays spécifique. Route publique, aucune authentification requise.'
  })
  @ApiResponse({ status: 200, description: 'Liste des artistes du pays', type: [ArtistDto] })
  @ApiResponse({ status: 404, description: 'Aucun artiste trouvé pour ce pays' })
  getArtistByCountry(@Param('country') country: string, @Req() req: Request) : Promise<Artist[]> { 
    return this.artistsService.findArtistByCountry(country);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ 
    summary: "Créer un nouvel artiste",
    description: 'Crée un nouvel artiste dans la base de données. Nécessite une authentification JWT avec le rôle ADMIN uniquement.'
  })
  @ApiBody({ type: ArtistDto })
  @ApiResponse({ status: 201, description: 'Artiste créé avec succès', type: ArtistDto })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle admin requis' })
  async create(@Body() body: ArtistDto, @Req() req: Request): Promise<Artist> {
    return this.artistsService.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    description: "ID de l'artiste à supprimer",
  })
  @Delete(':id')
  @ApiOperation({ 
    summary: "Supprimer un artiste",
    description: 'Supprime définitivement un artiste de la base de données. Nécessite une authentification JWT avec le rôle ADMIN uniquement.'
  })
  @ApiResponse({ status: 200, description: 'Artiste supprimé avec succès', type: ArtistDto })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle admin requis' })
  @ApiResponse({ status: 404, description: 'Artiste non trouvé' })
  async delete(@Param('id') id: number): Promise<Artist> {
    return this.artistsService.delete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    description: "ID de l'artiste à modifier",
  })
  @Patch(':id')
  @ApiOperation({ 
    summary: "Modifier un artiste",
    description: 'Met à jour les informations d\'un artiste existant. Seuls les champs fournis seront modifiés (mise à jour partielle). Nécessite une authentification JWT avec le rôle ADMIN uniquement.'
  })
  @ApiBody({ type: ArtistDto })
  @ApiResponse({ status: 200, description: 'Artiste mis à jour avec succès', type: ArtistDto })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle admin requis' })
  @ApiResponse({ status: 404, description: 'Artiste non trouvé' })
  async update(@Body() body: Partial<ArtistDto>, @Param('id') id: number): Promise<Artist> {
    return this.artistsService.update(id, body);
  }
}
