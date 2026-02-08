import { Module } from '@nestjs/common';
import { databaseProvider } from './db.provider';

@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
