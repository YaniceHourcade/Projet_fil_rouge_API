import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User as UserType} from '@prisma/client';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
type User = UserType & {
  fav: { id: number; name: string; genre: string; age: number | null; country: string; url: string | null}[];
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        fav: true,
      },
    });
  
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'id ${id} introuvable`);
    }
  
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: {
        fav: false,
      },
    });

    return users as User[];
  }

  async createUser(data: UserDto): Promise<UserType> {
    const newUser = await this.prisma.user.create({
      data: {
        username: data.username,
        password: await bcrypt.hash(data.password, 10),
        role: data.role || 'user',
      },
    });
    return newUser;
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

  async updateUser(userId: number, data: Partial<UserDto>): Promise<UserType> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    const updateData: any = {};

    if (data.username) {
      updateData.username = data.username;
    }
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updateUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return updateUser;
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
        fav: {
          connect: { id: artistId}, 
        },
      },
      include: {
        fav: true,
      },
    });
  
    if (!updateUser) {
      throw new NotFoundException(`Utilisateur avec l'id ${id} introuvable`);
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
        fav: {
          disconnect: { id: artistId}, 
        },
      },
      include: {
        fav: true,
      },
    });
  
    if (!updateUser) {
      throw new NotFoundException(`Utilisateur avec l'id ${id} introuvable`);
    }
  
    return updateUser;
  }

}
