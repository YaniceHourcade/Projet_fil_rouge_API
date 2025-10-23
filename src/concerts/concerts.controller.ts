import { Controller, Get } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { Concert } from '@prisma/client';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertService: ConcertsService) {}

  @Get()
  async findAll(): Promise<Concert[]> {
    return this.concertService.findAll();
  }
}
