import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User as UserType} from '@prisma/client';
import { UsersDto } from './users.dto';

type User = UserType & {
  favoris: { id: number; name: string; genre: string; age: number | null; country: string; url: string | null}[];
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        favoris: true,
      },
    });
  
    if (!user) {
      throw new NotFoundException(`Artiste avec l'id ${id} introuvable`);
    }
  
    return user;
  }

  async createUser(data: UsersDto): Promise<UserType> {
    return this.prisma.user.create({
      data,
    });
  }

  // Supprimer un utilisateur par ID
  async deleteUser(userId: number): Promise<UserType> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  // ajoute un favoris
  async addFav(id: number, artistId: number): Promise<User> {
    const artist = await this.prisma.artist.findUnique({
      where: { id : artistId },
    });

    if (!artist) {
      throw new NotFoundException(`Artiste avec l'id ${artistId} introuvable`);
    }

    const updateUser = await this.prisma.user.update({
      where: { id },
      data: {
        favoris: {
          connect: { id: artistId}, 
        },
      },
      include: {
        favoris: true,
      },
    });
  
    if (!updateUser) {
      throw new NotFoundException(`Artiste avec l'id ${id} introuvable`);
    }
  
    return updateUser;
  }

  // enleve un favoris
  async delFav(id: number, artistId: number): Promise<User> {
    const artist = await this.prisma.artist.findUnique({
      where: { id : artistId },
    });

    if (!artist) {
      throw new NotFoundException(`Artiste avec l'id ${artistId} introuvable`);
    }

    const updateUser = await this.prisma.user.update({
      where: { id },
      data: {
        favoris: {
          disconnect: { id: artistId}, 
        },
      },
      include: {
        favoris: true,
      },
    });
  
    if (!updateUser) {
      throw new NotFoundException(`Artiste avec l'id ${id} introuvable`);
    }
  
    return updateUser;
  }

}
