import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  sender: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  notifier: string;

  @Prop({ required: true })
  content: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
