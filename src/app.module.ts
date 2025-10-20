import { Module } from '@nestjs/common';
import { ArtistsModule } from './artists/artists.module';
import { UsersModule } from './users/users.module';
import { ConcertsModule } from './concerts/concerts.module';

@Module({
  imports: [UsersModule, ArtistsModule, ConcertsModule], 
})

export class AppModule {}
