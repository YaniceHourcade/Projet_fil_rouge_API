import { Controller, Get, Post, Delete, Body, Put, Param, UseGuards, Patch } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { Concert } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ConcertDto } from './dto/concert.dto';
import { RolesGuard } from '../auth/role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Concerts')
@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertService: ConcertsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Récupérer tous les concerts',
    description: 'Retourne la liste de tous les concerts disponibles. Route publique, aucune authentification requise.'
  })
  @ApiResponse({ status: 200, description: 'Liste des concerts', type: ConcertDto, isArray: true })
  async findAll(): Promise<Concert[]> {
    return this.concertService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Récupérer un concert par ID',
    description: 'Retourne les informations détaillées d\'un concert spécifique. Route publique, aucune authentification requise.'
  })
  @ApiParam({ name: 'id', type: Number, description: "ID du concert" })
  @ApiResponse({ status: 200, description: 'Concert trouvé', type: ConcertDto})
  @ApiResponse({ status: 404, description: 'Concert non trouvé' })
  async findOne(@Param('id') id: string): Promise<Concert | null> {
    return this.concertService.findOne(Number(id));
  }

  @Get('artist/:artistId')
  @ApiOperation({ 
    summary: 'Récupérer des concerts par ID d\'artiste',
    description: 'Retourne tous les concerts d\'un artiste spécifique. Route publique, aucune authentification requise.'
  })
  @ApiParam({ name: 'artistId', type: Number, description: "ID de l'artiste" })
  @ApiResponse({ status: 200, description: 'Concerts trouvés', type: ConcertDto, isArray: true })
  async findByArtistId(@Param('artistId') artistId: string): Promise<Concert[]> {
    return this.concertService.findByArtistId(Number(artistId));
  }

  @Get('location/:location')
  @ApiOperation({ 
    summary: 'Récupérer des concerts par lieu',
    description: 'Retourne tous les concerts d\'un lieu spécifique. Route publique, aucune authentification requise.'
  })
  @ApiParam({ name: 'location', type: String, description: "Lieu du concert" })
  @ApiResponse({ status: 200, description: 'Concerts trouvés', type: ConcertDto, isArray: true })
  async findByLocation(@Param('location') location: string): Promise<Concert[]> {
    return this.concertService.findByLocation(location);
  }

  @Get('genre/:genre')
  @ApiOperation({ 
    summary: 'Récupérer des concerts par genre',
    description: 'Retourne tous les concerts d\'un genre musical spécifique. Route publique, aucune authentification requise.'
  })
  @ApiParam({ name: 'genre', type: String, description: "Genre musical" })
  @ApiResponse({ status: 200, description: 'Concerts trouvés', type: ConcertDto, isArray: true })
  async findByGenre(@Param('genre') genre: string): Promise<Concert[]> {
    return this.concertService.findByGenre(genre);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Créer un nouveau concert',
    description: 'Crée un nouveau concert dans la base de données. Nécessite une authentification JWT avec le rôle ADMIN uniquement.'
  })
  @ApiBody({ type: ConcertDto })
  @ApiResponse({ status: 201, description: 'Concert créé avec succès', type: ConcertDto })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle admin requis' })
  async create(
    @Body() data: ConcertDto,
  ): Promise<Concert> {
    return this.concertService.create(data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Supprimer un concert',
    description: 'Supprime définitivement un concert de la base de données. Nécessite une authentification JWT avec le rôle ADMIN uniquement.'
  })
  @ApiParam({ name: 'id', type: Number, description: "ID du concert à supprimer" })
  @ApiResponse({ status: 200, description: 'Concert supprimé avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle admin requis' })
  @ApiResponse({ status: 404, description: 'Concert non trouvé' })
  async deleteOne(@Param('id') id: string): Promise<{ message: string }> {
    await this.concertService.deleteOne(Number(id));
    return { message: `Concert avec l'id ${id} supprimé avec succès.` };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Mettre à jour un concert',
    description: 'Met à jour les informations d\'un concert existant. Seuls les champs fournis seront modifiés (mise à jour partielle). Nécessite une authentification JWT avec le rôle ADMIN uniquement.'
  })
  @ApiParam({ name: 'id', type: Number, description: "ID du concert à modifier" })
  @ApiBody({ type: ConcertDto })
  @ApiResponse({ status: 200, description: 'Concert mis à jour avec succès', type: ConcertDto })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle admin requis' })
  @ApiResponse({ status: 404, description: 'Concert non trouvé' })
  async update(
    @Param('id') id: string,
    @Body() data: Partial<ConcertDto>,
  ): Promise<Concert> {
    return this.concertService.update(Number(id), data);
  }
}
