import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import * as mongoose from 'mongoose';

export interface Media {
  name: string;
  value: string;
  type: string;
}

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: string;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  hashtags: string[];

  @Prop([Object])
  medias: Media[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
