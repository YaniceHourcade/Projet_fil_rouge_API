import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.artist.findMany({ include: { albums: true, concerts: true } });
  }

  async create(data: { name: string; genre: string }) {
    return this.prismaService.artist.create({ data });
  }
}
