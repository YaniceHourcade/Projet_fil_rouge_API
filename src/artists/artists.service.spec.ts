import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ArtistsService', () => {
  let service: ArtistsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    artist: {
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
        ArtistsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ArtistsService>(ArtistsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all artists with albums and concerts', async () => {
      const mockArtists = [
        {
          id: 1,
          name: 'Artist 1',
          genre: 'Rock',
          albums: [],
          concerts: [],
        },
      ];

      mockPrismaService.artist.findMany.mockResolvedValue(mockArtists);

      const result = await service.findAll();

      expect(result).toEqual(mockArtists);
      expect(mockPrismaService.artist.findMany).toHaveBeenCalledWith({
        include: {
          albums: true,
          concerts: true,
        },
      });
    });
  });

  describe('findArtist', () => {
    it('should return artist by id', async () => {
      const mockArtist = {
        id: 1,
        name: 'Artist 1',
        genre: 'Rock',
        albums: [],
        concerts: [],
      };

      mockPrismaService.artist.findUnique.mockResolvedValue(mockArtist);

      const result = await service.findArtist(1);

      expect(result).toEqual(mockArtist);
    });

    it('should throw NotFoundException when artist does not exist', async () => {
      mockPrismaService.artist.findUnique.mockResolvedValue(null);

      await expect(service.findArtist(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchByName', () => {
    it('should return artists matching name', async () => {
      const mockArtists = [
        {
          id: 1,
          name: 'Artist Test',
          genre: 'Rock',
          albums: [],
          concerts: [],
        },
      ];

      mockPrismaService.artist.findMany.mockResolvedValue(mockArtists);

      const result = await service.searchByName('Test');

      expect(result).toEqual(mockArtists);
      expect(mockPrismaService.artist.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: 'Test',
          },
        },
        include: {
          albums: true,
          concerts: true,
        },
      });
    });
  });

  describe('findArtistByCountry', () => {
    it('should return artists by country', async () => {
      const mockArtists = [
        {
          id: 1,
          name: 'Artist 1',
          country: 'USA',
          albums: [],
          concerts: [],
        },
      ];

      mockPrismaService.artist.findMany.mockResolvedValue(mockArtists);

      const result = await service.findArtistByCountry('USA');

      expect(result).toEqual(mockArtists);
    });

    it('should throw NotFoundException when no artists found', async () => {
      mockPrismaService.artist.findMany.mockResolvedValue([]);

      await expect(service.findArtistByCountry('Unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findArtistByGenre', () => {
    it('should return artists by genre', async () => {
      const mockArtists = [
        {
          id: 1,
          name: 'Artist 1',
          genre: 'Rock',
          albums: [],
          concerts: [],
        },
      ];

      mockPrismaService.artist.findMany.mockResolvedValue(mockArtists);

      const result = await service.findArtistByGenre('Rock');

      expect(result).toEqual(mockArtists);
    });

    it('should throw NotFoundException when no artists found', async () => {
      mockPrismaService.artist.findMany.mockResolvedValue([]);

      await expect(service.findArtistByGenre('Unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new artist', async () => {
      const mockArtist = {
        id: 1,
        name: 'New Artist',
        genre: 'Rock',
        country: 'USA',
        age: 0,
        url: ''
      };

      mockPrismaService.artist.create.mockResolvedValue(mockArtist);

      const result = await service.create({
        name: 'New Artist',
        genre: 'Rock',
        country: 'USA',
        age: 0,
        url: ''
      });

      expect(result).toEqual(mockArtist);
      expect(mockPrismaService.artist.create).toHaveBeenCalledWith({
        data: {
          name: 'New Artist',
          genre: 'Rock',
          country: 'USA',
          age: 0,
        url: ''
        },
      });
    });
  });

  describe('update', () => {
    it('should update artist with partial data', async () => {
      const mockArtist = { id: 1, name: 'Old Name', genre: 'Rock' };
      const mockUpdatedArtist = { id: 1, name: 'New Name', genre: 'Rock' };

      mockPrismaService.artist.findUnique.mockResolvedValue(mockArtist);
      mockPrismaService.artist.update.mockResolvedValue(mockUpdatedArtist);

      const result = await service.update(1, { name: 'New Name' });

      expect(result).toEqual(mockUpdatedArtist);
      expect(mockPrismaService.artist.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'New Name' },
      });
    });

    it('should throw NotFoundException when artist does not exist', async () => {
      mockPrismaService.artist.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { name: 'New Name' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete artist when exists', async () => {
      const mockArtist = { id: 1, name: 'Artist 1', genre: 'Rock' };

      mockPrismaService.artist.findUnique.mockResolvedValue(mockArtist);
      mockPrismaService.artist.delete.mockResolvedValue(mockArtist);

      const result = await service.delete(1);

      expect(result).toEqual(mockArtist);
      expect(mockPrismaService.artist.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when artist does not exist', async () => {
      mockPrismaService.artist.findUnique.mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    });
  });
});

