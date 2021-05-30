import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  hashtags: string[];

  @Prop([String])
  images: string[];

  @Prop([String])
  videos: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
