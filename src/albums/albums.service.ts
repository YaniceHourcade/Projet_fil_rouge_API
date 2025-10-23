import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Albums } from '@prisma/client';

@Injectable()
export class AlbumsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Albums[]> {
    return this.prismaService.albums.findMany();
  }

  async create(data: { title: string; year: number; song: number; artistId: number }): Promise<Albums> {
    return this.prismaService.albums.create({
      data,
    });
  }
}
