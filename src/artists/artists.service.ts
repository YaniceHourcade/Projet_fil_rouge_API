import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Artist as ArtistType } from '@prisma/client';
import { ArtistDto } from './artists.dto';

type Artist = ArtistType & {
  albums: { id: number; title: string; year: number; artistId: number }[];
  concerts: { id: number; location: string; date: Date; artistId: number }[];
};

@Injectable()
export class ArtistsService {  
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany({
      include: {
        albums: true,
        concerts: true,
      },
    });
  }

  async findArtist(id: number): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        albums: true,
        concerts: true,
      },
    });
  
    if (!artist) {
      throw new NotFoundException(`Artiste avec l'id ${id} introuvable`);
    }
  
    return artist;
  }

  async findArtistByCountry(country: string): Promise<Artist[]> {
    const artists = await this.prisma.artist.findMany({
      where: { country },
      include: {
        albums: true,
        concerts: true,
      },
    });
  
    if (artists.length===0) {
      throw new NotFoundException(`Artiste avec le pays ${country} introuvable`);
    }
  
    return artists;
  }
  
  async findArtistByGenre(genre: string): Promise<Artist[]> {
    const artists = await this.prisma.artist.findMany({
      where: { genre },
      include: {
        albums: true,
        concerts: true,
      },
    });
  
    if (artists.length===0) {
      throw new NotFoundException(`Artiste avec le genre ${genre} introuvable`);
    }
  
    return artists;
  }

  async create(data: ArtistDto): Promise<ArtistType> {
    return this.prisma.artist.create({
      data,
    });
  }

  async delete(id: number): Promise<ArtistType> {
    const artist = await this.prisma.artist.findUnique({
      where: { id }
    });
  
    if (!artist) {
      throw new NotFoundException(`Artiste avec l'id ${id} introuvable`);
    }
  
    const deletedArtist = await this.prisma.artist.delete({
      where: { id },
    });
  
    return deletedArtist;
  }
  

  async update(id: number, data: ArtistDto): Promise<ArtistType>
  {
    const artist = await this.prisma.artist.findUnique({
      where: { id }
    });
  
    if (!artist) {
      throw new NotFoundException(`Artiste avec l'id ${id} introuvable`);
    }

    const updateArtist = this.prisma.artist.update({
      where: { id },
      data: data 
    });
  
    return updateArtist;
  }
}
