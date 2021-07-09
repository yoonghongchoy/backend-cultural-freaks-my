import { Injectable } from '@nestjs/common';
import { MongoGridFS } from 'mongo-gridfs';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { GridFSBucketReadStream } from 'mongodb';

@Injectable()
export class FileService {
  private fileModel: MongoGridFS;

  constructor(@InjectConnection() private readonly connection: Connection) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.fileModel = new MongoGridFS(this.connection.db, 'fs');
  }

  async getBase64(id: string) {
    const readStream = await this.fileModel.readFileStream(id);
    return await this.convertStreamToBase64(readStream);
  }

  async convertStreamToBase64(readStream: GridFSBucketReadStream) {
    let base64data = '';

    return new Promise((resolve) => {
      readStream.on('data', function (result) {
        base64data += new Buffer(result).toString('base64');
      });

      readStream.on('end', function () {
        // console.log('dbResult : ' + base64data.substring(0, 50));
        //do your stuff here with base64data which contains string encoded in base64 format.....
        resolve(base64data);
      });
    });
  }

  async deleteFile(id: string) {
    return this.fileModel.delete(id);
  }
}
