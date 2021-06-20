import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema({ timestamps: true })
export class Friend extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user1: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user2: string;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
