import { Module } from '@nestjs/common';
import { ArtistsModule } from './artists/artists.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ArtistsModule],
  
})

@Module({
  imports: [UsersModule],
})

export class AppModule {}
