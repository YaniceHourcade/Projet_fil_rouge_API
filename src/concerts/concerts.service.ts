import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Concert } from '@prisma/client';
import { ConcertDto } from './dto/concert.dto';

@Injectable()
export class ConcertsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.concert.findMany();
  }

  async findOne(id: number): Promise<Concert | null> {
    return this.prisma.concert.findUnique({
      where: { id },
    });
  }

  async findByArtistId(artistId: number): Promise<Concert[]> {
    return this.prisma.concert.findMany({
      where: { artistId },
    });
  }

  async findByLocation(location: string): Promise<Concert[]> {
    return this.prisma.concert.findMany({
      where: { location },
    });
  }

  async findByGenre(genre: string): Promise<Concert[]> {
    return this.prisma.concert.findMany({
      where: {
        artist: {
          genre,
        },
      },
    });
  }

  async create(createConcertDto: ConcertDto): Promise<Concert> {
    return this.prisma.concert.create({ data: {
        ...createConcertDto,
        date: new Date(createConcertDto.date),
      }, 
    });
  }

  async deleteOne(id: number): Promise<Concert> {
    return this.prisma.concert.delete({
      where: { id },
    });
  }

  async update(id: number, data: Partial<ConcertDto>): Promise<Concert> {
    const concert = await this.prisma.concert.findUnique({
      where: { id },
    });

    if (!concert) {
      throw new NotFoundException(`Concert avec l'id ${id} introuvable`);
    }

    const updateData: any = { ...data };

    if (data.date) {
      updateData.date = new Date(data.date);
    }

    return this.prisma.concert.update({
      where: { id },
      data: updateData,
    });
  }
}
