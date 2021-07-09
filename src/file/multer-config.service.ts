import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { GridFsStorage } from 'multer-gridfs-storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GridFsMulterConfigService implements MulterOptionsFactory {
  gridFsStorage;

  constructor(private configService: ConfigService) {
    this.gridFsStorage = new GridFsStorage({
      url: configService.get<string>('mongodb_uri'),
      file: (req, file) => {
        // return new Promise((resolve, reject) => {
        //   const filename = file.originalname.trim();
        //   const fileInfo = {
        //     filename: filename,
        //   };
        //   resolve(fileInfo);
        // });
        return {
          filename: file.originalname.trim() + '_' + Date.now(),
        };
      },
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: this.gridFsStorage,
    };
  }
}
