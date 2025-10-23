import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Concert } from '@prisma/client';

@Injectable()
export class ConcertsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.concert.findMany();
  }

}
