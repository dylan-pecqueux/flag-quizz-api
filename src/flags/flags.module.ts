import { Module } from '@nestjs/common';
import { FlagsService } from './flags.service';
import { FlagsController } from './flags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flag } from './entities/flag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flag])],
  controllers: [FlagsController],
  providers: [FlagsService],
})
export class FlagsModule {}
