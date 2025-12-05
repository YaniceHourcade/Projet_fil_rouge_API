import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    artist: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUser', () => {
    it('should return user with favoris', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        role: 'user',
        favoris: [
          { id: 1, name: 'Artist 1', genre: 'Rock', age: 30, country: 'USA', url: null },
        ],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findUser(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { favoris: true },
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findUser(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', role: 'user' },
        { id: 2, username: 'user2', role: 'admin' },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        include: { favoris: false },
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const mockNewUser = {
        id: 1,
        username: 'newuser',
        password: 'hashedPassword',
        role: 'user',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue(mockNewUser);

      const result = await service.createUser({
        username: 'newuser',
        password: 'password123',
      });

      expect(result).toEqual(mockNewUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('should use default role "user" when not provided', async () => {
      const mockNewUser = {
        id: 1,
        username: 'newuser',
        password: 'hashedPassword',
        role: 'user',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue(mockNewUser);

      await service.createUser({
        username: 'newuser',
        password: 'password123',
      });

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          username: 'newuser',
          password: 'hashedPassword',
          role: 'user',
        },
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user when exists', async () => {
      const mockUser = { id: 1, username: 'testuser', role: 'user' };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.deleteUser(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.deleteUser(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update user username', async () => {
      const mockUser = { id: 1, username: 'olduser', role: 'user' };
      const mockUpdatedUser = { id: 1, username: 'newuser', role: 'user' };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateUser(1, { username: 'newuser' });

      expect(result).toEqual(mockUpdatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { username: 'newuser' },
      });
    });

    it('should update user password with hash', async () => {
      const mockUser = { id: 1, username: 'testuser', role: 'user' };
      const mockUpdatedUser = { id: 1, username: 'testuser', password: 'hashedPassword', role: 'user' };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser);

      await service.updateUser(1, { password: 'newpassword' });

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { password: 'hashedPassword' },
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.updateUser(999, { username: 'newuser' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('addFav', () => {
    it('should add artist to user favorites', async () => {
      const mockArtist = { id: 1, name: 'Artist 1', genre: 'Rock' };
      const mockUser = {
        id: 1,
        username: 'testuser',
        favoris: [mockArtist],
      };

      mockPrismaService.artist.findUnique.mockResolvedValue(mockArtist);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.addFav(1, 1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          favoris: {
            connect: { id: 1 },
          },
        },
        include: { favoris: true },
      });
    });

    it('should throw NotFoundException when artist does not exist', async () => {
      mockPrismaService.artist.findUnique.mockResolvedValue(null);

      await expect(service.addFav(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delFav', () => {
    it('should remove artist from user favorites', async () => {
      const mockArtist = { id: 1, name: 'Artist 1', genre: 'Rock' };
      const mockUser = {
        id: 1,
        username: 'testuser',
        favoris: [],
      };

      mockPrismaService.artist.findUnique.mockResolvedValue(mockArtist);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.delFav(1, 1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          favoris: {
            disconnect: { id: 1 },
          },
        },
        include: { favoris: true },
      });
    });

    it('should throw NotFoundException when artist does not exist', async () => {
      mockPrismaService.artist.findUnique.mockResolvedValue(null);

      await expect(service.delFav(1, 999)).rejects.toThrow(NotFoundException);
    });
  });
});

