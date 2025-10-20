import { Controller, Get, Post, Body } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { Artist } from '@prisma/client';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  async findAll(): Promise<Artist[]> {
    return this.artistsService.findAll();
  }

  @Post()
  async create(
    @Body()
    body: { name: string; genre: string; age: number; country: string; url: string },
  ): Promise<Artist> {
    return this.artistsService.create(body);
  }
}
