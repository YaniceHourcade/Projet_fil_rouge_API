import { Controller, Get, Post, Delete, Body, Put, Param } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { Concert } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateConcertDto } from './dto/create_concerts.dto';

@ApiTags('Concerts')
@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertService: ConcertsService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les concerts' })
  @ApiResponse({ status: 200, description: 'Liste des concerts', type: Object, isArray: true })
  async findAll(): Promise<Concert[]> {
    return this.concertService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un concert par ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Concert trouvé', type: Object })
  async findOne(@Param('id') id: string): Promise<Concert | null> {
    return this.concertService.findOne(Number(id));
  }

  @Get('artist/:artistId')
  @ApiOperation({ summary: 'Récupérer des concerts par ID d’artiste' })
  @ApiParam({ name: 'artistId', type: Number })
  @ApiResponse({ status: 200, description: 'Concerts trouvés', type: Object, isArray: true })
  async findByArtistId(@Param('artistId') artistId: string): Promise<Concert[]> {
    return this.concertService.findByArtistId(Number(artistId));
  }

  @Get('location/:location')
  @ApiOperation({ summary: 'Récupérer des concerts par lieu' })
  @ApiParam({ name: 'location', type: String })
  @ApiResponse({ status: 200, description: 'Concerts trouvés', type: Object, isArray: true })
  async findByLocation(@Param('location') location: string): Promise<Concert[]> {
    return this.concertService.findByLocation(location);
  }

  @Get('genre/:genre')
  @ApiOperation({ summary: 'Récupérer des concerts par genre' })
  @ApiParam({ name: 'genre', type: String })
  @ApiResponse({ status: 200, description: 'Concerts trouvés', type: Object, isArray: true })
  async findByGenre(@Param('genre') genre: string): Promise<Concert[]> {
    return this.concertService.findByGenre(genre);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau concert' })
  @ApiBody({ type: CreateConcertDto })
  @ApiResponse({ status: 201, description: 'Concert créé', type: Object })
  async create(
    @Body() createConcertDto: CreateConcertDto,
  ): Promise<Concert> {
    return this.concertService.create(createConcertDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Supprimer tous les concerts' })
  @ApiResponse({ status: 200, description: 'Concerts supprimés' })
  async deleteAll(): Promise<{ message: string; count: number}> { 
    const result = await this.concertService.deleteAll();
    return {
      message: `${result.count} concerts supprimés avec succès.`,
      count: result.count,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un concert' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Concert supprimé' })
  async deleteOne(@Param('id') id: string): Promise<{ message: string }> {
    await this.concertService.deleteOne(Number(id));
    return { message: `Concert avec l'id ${id} supprimé avec succès.` };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un concert' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateConcertDto })
  @ApiResponse({ status: 200, description: 'Concert mis à jour', type: Object })
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Concert>,
  ): Promise<Concert> {
    return this.concertService.update(Number(id), data);
  }
}
