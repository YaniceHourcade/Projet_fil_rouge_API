import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Artist } from '@prisma/client';

type ArtistWithRelations = Artist & {
  albums: { id: number; title: string; year: number; artistId: number }[];
  concerts: { id: number; location: string; date: Date; artistId: number }[];
};

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async create(data: { name: string; genre: string; age: number; country: string; url: string }): Promise<Artist> {
    return this.prisma.artist.create({
      data,
    });
  }
}
