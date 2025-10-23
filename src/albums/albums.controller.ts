import { Controller, Get, Post, Body } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { Albums } from '@prisma/client';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async findAll(): Promise<Albums[]> {
    return this.albumsService.findAll();
  }

  @Post()
  async create(
    @Body()
    body: { title: string; year: number; song: number; artistId: number },
  ): Promise<Albums> {
    return this.albumsService.create(body);
  }
}
