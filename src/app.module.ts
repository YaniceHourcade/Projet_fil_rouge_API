import { Module } from '@nestjs/common';
import { ArtistsModule } from './artists/artists.module';
import { UsersModule } from './users/users.module';
import { ConcertsModule } from './concerts/concerts.module';
import { AlbumsModule } from './albums/albums.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, ArtistsModule, ConcertsModule, AlbumsModule, AuthModule],
})



export class AppModule {}
