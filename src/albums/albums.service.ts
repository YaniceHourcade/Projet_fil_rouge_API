import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Albums } from '@prisma/client';
import { AlbumDto } from './dto/album.dto';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Albums[]> {
    return this.prisma.albums.findMany();
  }

  async findOne(id: number): Promise<Albums | null> {
    return this.prisma.albums.findUnique({
      where: { id },
    });
  }

  async findByArtistId(artistId: number): Promise<Albums[]> {
    return this.prisma.albums.findMany({
      where: { artistId },
      //include: { artist: true }, (si on veut les infos de l'artiste aussi)
    });
  }

  async findByGenre(genre: string): Promise<Albums[]> {
    return this.prisma.albums.findMany({
      where: {
        artist: {
          genre
        },
      },
    });
  }
  
  async create(createAlbumDto: AlbumDto): Promise<Albums> {
    return this.prisma.albums.create({ data: createAlbumDto });
  }

  async deleteOne(id: number): Promise<Albums> {
    return this.prisma.albums.delete({
      where: { id },
    });
  }

  async update(id: number, data: Partial<AlbumDto>): Promise<Albums> {
    const album = await this.prisma.albums.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException(`Album avec l'id ${id} introuvable`);
    }

    return this.prisma.albums.update({
      where: { id },
      data,
    });
  }
}
