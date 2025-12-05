import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Album } from '@prisma/client';
import { AlbumDto } from './dto/album.dto';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async findOne(id: number): Promise<Album | null> {
    return this.prisma.album.findUnique({
      where: { id },
    });
  }

  async findByArtistId(artistId: number): Promise<Album[]> {
    return this.prisma.album.findMany({
      where: { artistId },
    });
  }

  async findByGenre(genre: string): Promise<Album[]> {
    return this.prisma.album.findMany({
      where: {
        artist: {
          genre
        },
      },
    });
  }
  
  async create(createAlbumDto: AlbumDto): Promise<Album> {
    return this.prisma.album.create({ data: createAlbumDto });
  }

  async deleteOne(id: number): Promise<Album> {
    return this.prisma.album.delete({
      where: { id },
    });
  }

  async update(id: number, data: Partial<AlbumDto>): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException(`Album avec l'id ${id} introuvable`);
    }

    return this.prisma.album.update({
      where: { id },
      data,
    });
  }
}
