import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer-config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from './file.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: GridFsMulterConfigService,
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [GridFsMulterConfigService, FileService],
  exports: [FileService],
})
export class FileModule {}
