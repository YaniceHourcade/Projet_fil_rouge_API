import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Albums } from '@prisma/client';
import { CreateAlbumDto } from './dto/create_albums.dto';

@Injectable()
export class AlbumsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Albums[]> {
    return this.prismaService.albums.findMany();
  }

  async findOne(id: number): Promise<Albums | null> {
    return this.prismaService.albums.findUnique({
      where: { id },
    });
  }

  async findByArtistId(artistId: number): Promise<Albums[]> {
    return this.prismaService.albums.findMany({
      where: { artistId },
      include: { artist: true },
    });
  }

  async findByGenre(genre: string): Promise<Albums[]> {
    return this.prismaService.albums.findMany({
      where: {
        artist: {
          genre
        },
      },
    });
  }
  
  async create(createAlbumDto: CreateAlbumDto): Promise<Albums> {
    return this.prismaService.albums.create({ data: createAlbumDto });
  }

  async deleteAll(): Promise<{ count: number }> {
    return this.prismaService.albums.deleteMany();
  }

  async deleteOne(id: number): Promise<Albums> {
    return this.prismaService.albums.delete({
      where: { id },
    });
  }

  async update(id: number, data: Partial<Albums>): Promise<Albums> {
    return this.prismaService.albums.update({
      where: { id },
      data,
    });
  }
}
