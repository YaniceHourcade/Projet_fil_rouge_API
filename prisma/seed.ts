import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  // Hash des mots de passe
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('alicepass', 10);
  const hashedPassword3 = await bcrypt.hash('marcpass', 10);
  const hashedPassword4 = await bcrypt.hash('sarapass', 10);
  const hashedPassword5 = await bcrypt.hash('johnpass', 10);

  // Users
  await prisma.user.createMany({
    data: [
      { username: 'noemie', password: hashedPassword1, role: 'admin' },
      { username: 'alice', password: hashedPassword2 },
      { username: 'marc', password: hashedPassword3 },
      { username: 'sara', password: hashedPassword4 },
      { username: 'john', password: hashedPassword5 }
    ]
  });

  // Artists
  await prisma.artist.createMany({
    data: [
      { name: 'Imagine Dragons', genre: 'Rock', age: 35, country: 'USA', url: 'https://imaginedragons.com' },
      { name: 'Dua Lipa', genre: 'Pop', age: 28, country: 'UK', url: 'https://dualipa.com' },
      { name: 'Daft Punk', genre: 'Electronic', age: 45, country: 'France', url: 'https://daftpunk.com' },
      { name: 'Kendrick Lamar', genre: 'Hip-Hop', age: 36, country: 'USA', url: 'https://kendricklamar.com' },
      { name: 'Angèle', genre: 'Pop', age: 28, country: 'Belgium', url: 'https://angele.com' }
    ]
  });

  // Albums
  await prisma.album.createMany({
    data: [
      { title: 'Evolve', year: 2017, song: 12, artistId: 1 },
      { title: 'Night Visions', year: 2012, song: 11, artistId: 1 },

      { title: 'Future Nostalgia', year: 2020, song: 11, artistId: 2 },
      { title: 'Dua Lipa', year: 2017, song: 12, artistId: 2 },

      { title: 'Random Access Memories', year: 2013, song: 13, artistId: 3 },
      { title: 'Discovery', year: 2001, song: 14, artistId: 3 },

      { title: 'DAMN.', year: 2017, song: 14, artistId: 4 },
      { title: 'good kid, m.A.A.d city', year: 2012, song: 12, artistId: 4 },

      { title: 'Brol', year: 2018, song: 12, artistId: 5 },
      { title: 'Nonante-Cinq', year: 2021, song: 13, artistId: 5 }
    ]
  });

  // Concerts
  await prisma.concert.createMany({
    data: [
      { location: 'Paris - Accor Arena', date: new Date('2025-06-20T20:00:00'), place: 20000, artistId: 1 },
      { location: 'Londres - O2 Arena', date: new Date('2025-09-10T20:00:00'), place: 15000, artistId: 1 },

      { location: 'Bruxelles - Palais 12', date: new Date('2025-08-15T20:00:00'), place: 14000, artistId: 2 },
      { location: 'New York - Madison Square Garden', date: new Date('2025-11-05T20:00:00'), place: 18000, artistId: 2 },

      { location: 'Paris - Bercy', date: new Date('2025-07-03T20:00:00'), place: 17000, artistId: 3 },
      { location: 'Los Angeles - Staples Center', date: new Date('2025-10-22T20:00:00'), place: 19000, artistId: 4 },

      { location: 'Bruxelles - Forest National', date: new Date('2025-05-14T20:00:00'), place: 9000, artistId: 5 }
    ]
  });

  // User → Artist Favorites
  await prisma.user.update({
    where: { id: 1 },
    data: { fav: { connect: [{ id: 3 }, { id: 5 }] } }
  });

  await prisma.user.update({
    where: { id: 2 },
    data: { fav: { connect: [{ id: 1 }, { id: 2 }] } }
  });

  await prisma.user.update({
    where: { id: 3 },
    data: { fav: { connect: [{ id: 4 }] } }
  });

  await prisma.user.update({
    where: { id: 4 },
    data: { fav: { connect: [{ id: 1 }] } }
  });

  await prisma.user.update({
    where: { id: 5 },
    data: { fav: { connect: [{ id: 3 }, { id: 2 }] } }
  });

}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
