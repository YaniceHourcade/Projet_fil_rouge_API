import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    concert: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all concerts', async () => {
      const mockConcerts = [
        {
          id: 1,
          location: 'Paris',
          date: new Date('2024-01-01'),
          place: 5000,
          artistId: 1,
        },
      ];

      mockPrismaService.concert.findMany.mockResolvedValue(mockConcerts);

      const result = await service.findAll();

      expect(result).toEqual(mockConcerts);
    });
  });

  describe('findOne', () => {
    it('should return concert by id', async () => {
      const mockConcert = {
        id: 1,
        location: 'Paris',
        date: new Date('2024-01-01'),
        place: 5000,
        artistId: 1,
      };

      mockPrismaService.concert.findUnique.mockResolvedValue(mockConcert);

      const result = await service.findOne(1);

      expect(result).toEqual(mockConcert);
    });

    it('should return null when concert does not exist', async () => {
      mockPrismaService.concert.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findByArtistId', () => {
    it('should return concerts by artist id', async () => {
      const mockConcerts = [
        {
          id: 1,
          location: 'Paris',
          date: new Date('2024-01-01'),
          place: 5000,
          artistId: 1,
        },
      ];

      mockPrismaService.concert.findMany.mockResolvedValue(mockConcerts);

      const result = await service.findByArtistId(1);

      expect(result).toEqual(mockConcerts);
      expect(mockPrismaService.concert.findMany).toHaveBeenCalledWith({
        where: { artistId: 1 },
      });
    });
  });

  describe('findByLocation', () => {
    it('should return concerts by location', async () => {
      const mockConcerts = [
        {
          id: 1,
          location: 'Paris',
          date: new Date('2024-01-01'),
          place: 5000,
          artistId: 1,
        },
      ];

      mockPrismaService.concert.findMany.mockResolvedValue(mockConcerts);

      const result = await service.findByLocation('Paris');

      expect(result).toEqual(mockConcerts);
      expect(mockPrismaService.concert.findMany).toHaveBeenCalledWith({
        where: { location: 'Paris' },
      });
    });
  });

  describe('findByGenre', () => {
    it('should return concerts by genre', async () => {
      const mockConcerts = [
        {
          id: 1,
          location: 'Paris',
          date: new Date('2024-01-01'),
          place: 5000,
          artistId: 1,
        },
      ];

      mockPrismaService.concert.findMany.mockResolvedValue(mockConcerts);

      const result = await service.findByGenre('Rock');

      expect(result).toEqual(mockConcerts);
      expect(mockPrismaService.concert.findMany).toHaveBeenCalledWith({
        where: {
          artist: {
            genre: 'Rock',
          },
        },
      });
    });
  });

  describe('create', () => {
    it('should create a new concert', async () => {
      const mockConcert = {
        id: 1,
        location: 'Paris',
        date: new Date('2024-01-01'),
        place: 5000,
        artistId: 1,
      };

      mockPrismaService.concert.create.mockResolvedValue(mockConcert);

      const result = await service.create({
        location: 'Paris',
        date: '2024-01-01',
        place: 5000,
        artistId: 1,
      });

      expect(result).toEqual(mockConcert);
      expect(mockPrismaService.concert.create).toHaveBeenCalledWith({
        data: {
          location: 'Paris',
          date: new Date('2024-01-01'),
          place: 5000,
          artistId: 1,
        },
      });
    });
  });

  describe('update', () => {
    it('should update concert with partial data', async () => {
      const mockConcert = {
        id: 1,
        location: 'Old Location',
        date: new Date('2024-01-01'),
        place: 5000,
        artistId: 1,
      };
      const mockUpdatedConcert = {
        id: 1,
        location: 'New Location',
        date: new Date('2024-01-01'),
        place: 5000,
        artistId: 1,
      };

      mockPrismaService.concert.findUnique.mockResolvedValue(mockConcert);
      mockPrismaService.concert.update.mockResolvedValue(mockUpdatedConcert);

      const result = await service.update(1, { location: 'New Location' });

      expect(result).toEqual(mockUpdatedConcert);
      expect(mockPrismaService.concert.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { location: 'New Location' },
      });
    });

    it('should convert date string to Date object when updating', async () => {
      const mockConcert = {
        id: 1,
        location: 'Paris',
        date: new Date('2024-01-01'),
        place: 5000,
        artistId: 1,
      };

      mockPrismaService.concert.findUnique.mockResolvedValue(mockConcert);
      mockPrismaService.concert.update.mockResolvedValue(mockConcert);

      await service.update(1, { date: '2024-12-31' });

      expect(mockPrismaService.concert.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { date: new Date('2024-12-31') },
      });
    });

    it('should throw NotFoundException when concert does not exist', async () => {
      mockPrismaService.concert.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { location: 'New Location' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteOne', () => {
    it('should delete concert', async () => {
      const mockConcert = {
        id: 1,
        location: 'Paris',
        date: new Date('2024-01-01'),
        place: 5000,
        artistId: 1,
      };

      mockPrismaService.concert.delete.mockResolvedValue(mockConcert);

      const result = await service.deleteOne(1);

      expect(result).toEqual(mockConcert);
      expect(mockPrismaService.concert.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});

