import { Controller, Get, Post, Body } from '@nestjs/common';
import { ArtistsService } from './artists.service';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  async findAll(): Promise<(Artist & { albums: any[]; concerts: any[] })[]> {
    return this.artistsService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; genre: string }) {
    return this.artistsService.create(body);
  }
}
