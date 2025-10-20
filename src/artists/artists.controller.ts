import { Controller, Get, Post, Body } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { Artist } from '@prisma/client';

type ArtistWithRelations = Artist & {
  albums: { id: number; title: string; year: number; artistId: number }[];
  concerts: { id: number; location: string; date: Date; artistId: number }[];
};

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  // GET /artists
  @Get()
  async findAll(): Promise<ArtistWithRelations[]> {
    return this.artistsService.findAll();
  }

  // POST /artists
  @Post()
  async create(
    @Body() body: { name: string; genre: string },
  ): Promise<ArtistWithRelations> {
    return this.artistsService.create(body);
  }
}
