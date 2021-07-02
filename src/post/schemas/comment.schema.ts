import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import * as mongoose from 'mongoose';
import { Post } from './post.schema';

@Schema({ timestamps: true })
export class Comments extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: string;

  @Prop()
  level: number;

  @Prop({ required: true })
  comment: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Comments.name }],
    default: [],
  })
  subComments: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comments);
