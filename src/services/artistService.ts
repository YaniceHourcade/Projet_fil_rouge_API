import prisma from "../prisma/prismaClient";

export const getAllArtists = async () => {
  return prisma.artist.findMany({ include: { albums: true, concerts: true } });
};

export const createArtist = async (data: { name: string; genre: string }) => {
  return prisma.artist.create({ data });
};
