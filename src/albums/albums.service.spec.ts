import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AlbumsService', () => {
  let service: AlbumsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    albums: {
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
        AlbumsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AlbumsService>(AlbumsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all albums', async () => {
      const mockAlbums = [
        { id: 1, title: 'Album 1', year: 2020, song: 10, artistId: 1 },
      ];

      mockPrismaService.albums.findMany.mockResolvedValue(mockAlbums);

      const result = await service.findAll();

      expect(result).toEqual(mockAlbums);
    });
  });

  describe('findOne', () => {
    it('should return album by id', async () => {
      const mockAlbum = {
        id: 1,
        title: 'Album 1',
        year: 2020,
        song: 10,
        artistId: 1,
      };

      mockPrismaService.albums.findUnique.mockResolvedValue(mockAlbum);

      const result = await service.findOne(1);

      expect(result).toEqual(mockAlbum);
    });

    it('should return null when album does not exist', async () => {
      mockPrismaService.albums.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findByArtistId', () => {
    it('should return albums by artist id', async () => {
      const mockAlbums = [
        { id: 1, title: 'Album 1', year: 2020, song: 10, artistId: 1 },
      ];

      mockPrismaService.albums.findMany.mockResolvedValue(mockAlbums);

      const result = await service.findByArtistId(1);

      expect(result).toEqual(mockAlbums);
      expect(mockPrismaService.albums.findMany).toHaveBeenCalledWith({
        where: { artistId: 1 },
      });
    });
  });

  describe('findByGenre', () => {
    it('should return albums by genre', async () => {
      const mockAlbums = [
        { id: 1, title: 'Album 1', year: 2020, song: 10, artistId: 1 },
      ];

      mockPrismaService.albums.findMany.mockResolvedValue(mockAlbums);

      const result = await service.findByGenre('Rock');

      expect(result).toEqual(mockAlbums);
      expect(mockPrismaService.albums.findMany).toHaveBeenCalledWith({
        where: {
          artist: {
            genre: 'Rock',
          },
        },
      });
    });
  });

  describe('create', () => {
    it('should create a new album', async () => {
      const mockAlbum = {
        id: 1,
        title: 'New Album',
        year: 2023,
        song: 12,
        artistId: 1,
      };

      mockPrismaService.albums.create.mockResolvedValue(mockAlbum);

      const result = await service.create({
        title: 'New Album',
        year: 2023,
        song: 12,
        artistId: 1,
      });

      expect(result).toEqual(mockAlbum);
      expect(mockPrismaService.albums.create).toHaveBeenCalledWith({
        data: {
          title: 'New Album',
          year: 2023,
          song: 12,
          artistId: 1,
        },
      });
    });
  });

  describe('update', () => {
    it('should update album with partial data', async () => {
      const mockAlbum = { id: 1, title: 'Old Title', year: 2020 };
      const mockUpdatedAlbum = { id: 1, title: 'New Title', year: 2020 };

      mockPrismaService.albums.findUnique.mockResolvedValue(mockAlbum);
      mockPrismaService.albums.update.mockResolvedValue(mockUpdatedAlbum);

      const result = await service.update(1, { title: 'New Title' });

      expect(result).toEqual(mockUpdatedAlbum);
      expect(mockPrismaService.albums.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'New Title' },
      });
    });

    it('should throw NotFoundException when album does not exist', async () => {
      mockPrismaService.albums.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { title: 'New Title' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteOne', () => {
    it('should delete album', async () => {
      const mockAlbum = {
        id: 1,
        title: 'Album 1',
        year: 2020,
        song: 10,
        artistId: 1,
      };

      mockPrismaService.albums.delete.mockResolvedValue(mockAlbum);

      const result = await service.deleteOne(1);

      expect(result).toEqual(mockAlbum);
      expect(mockPrismaService.albums.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});

