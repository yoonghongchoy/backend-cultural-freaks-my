import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Post } from '@nestjs/common';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  sender: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  notifier: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Post.name })
  post: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
