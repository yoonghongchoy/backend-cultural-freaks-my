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

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
    default: [],
  })
  likes: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
