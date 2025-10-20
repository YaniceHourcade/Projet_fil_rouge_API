import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Artist } from '@prisma/client';

type ArtistWithRelations = Artist & {
  albums: { id: number; title: string; year: number; artistId: number }[];
  concerts: { id: number; location: string; date: Date; artistId: number }[];
};

@Injectable()
export class ArtistsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<ArtistWithRelations[]> {
    return this.prismaService.artist.findMany({
      include: { albums: true, concerts: true },
    });
  }

  async create(data: { name: string; genre: string }): Promise<ArtistWithRelations> {
    return this.prismaService.artist.create({
      data,
      include: { albums: true, concerts: true },
    });
  }
}
